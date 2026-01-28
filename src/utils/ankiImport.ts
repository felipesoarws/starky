import initSqlJs from "sql.js";
import JSZip from "jszip";
import type { Deck, Card } from "../components/overview/types";

export async function importAnkiDeck(file: File): Promise<Deck[]> {
    const zip = new JSZip();
    const content = await zip.loadAsync(file);

    // Anki 2.1 uses collection.anki21, older uses collection.anki2
    const dbFile = content.file("collection.anki21") || content.file("collection.anki2");

    if (!dbFile) {
        throw new Error("Invalid .apkg file: collection database not found.");
    }

    const dbData = await dbFile.async("uint8array");

    const SQL = await initSqlJs({
        locateFile: (file) => `/${file}`,
    });

    const db = new SQL.Database(dbData);

    try {
        // Get decks
        // In Anki, decks are often stored as JSON in the 'col' table 'decks' column
        const colResult = db.exec("SELECT decks FROM col");
        if (colResult.length === 0) {
            throw new Error("Could not find decks in collection.");
        }

        const decksJson = JSON.parse(colResult[0].values[0][0] as string);
        const decks: Deck[] = [];

        // Map deck ID to deck name
        const deckMap = new Map<string, string>();
        for (const id in decksJson) {
            deckMap.set(id, decksJson[id].name);
        }

        // Get cards and notes
        // flds contains the fields separated by 0x1f (unit separator)
        // usually field 0 is Front and field 1 is Back
        const cardsResult = db.exec(`
      SELECT 
        c.did, 
        n.flds,
        c.id
      FROM cards c
      JOIN notes n ON c.nid = n.id
    `);

        if (cardsResult.length > 0) {
            const rows = cardsResult[0].values;
            const deckCardsMap = new Map<string, Card[]>();

            rows.forEach((row) => {
                const deckId = String(row[0]);
                const flds = row[1] as string;
                const cardId = row[2] as number;

                const fields = flds.split("\u001f");
                const rawQuestion = fields[0] || "";
                const rawAnswer = fields[1] || "";

                // Skip if contains images
                if (rawQuestion.includes("<img") || rawAnswer.includes("<img")) {
                    return;
                }

                const cleanedQuestion = cleanAnkiHtml(rawQuestion);
                const cleanedAnswer = cleanAnkiHtml(rawAnswer);

                // Skip if empty
                if (!cleanedQuestion || !cleanedAnswer) {
                    return;
                }

                if (!deckCardsMap.has(deckId)) {
                    deckCardsMap.set(deckId, []);
                }

                deckCardsMap.get(deckId)?.push({
                    id: cardId,
                    question: cleanedQuestion,
                    answer: cleanedAnswer,
                });
            });

            // Assemble Decks
            deckCardsMap.forEach((cards, deckId) => {
                const deckName = deckMap.get(deckId) || `Imported Deck ${deckId}`;
                decks.push({
                    id: parseInt(deckId) || Date.now() + Math.random(),
                    title: deckName,
                    category: "Importado",
                    cards: cards,
                    lastStudied: "Nunca",
                });
            });
        }

        return decks;
    } finally {
        db.close();
    }
}

function cleanAnkiHtml(html: string): string {
    // Simple cleanup of Anki's HTML tags if needed
    // For now, just return as is or strip common ones
    return html
        .replace(/&nbsp;/g, " ")
        .replace(/<div>/g, "")
        .replace(/<\/div>/g, "\n")
        .replace(/<br\s*\/?>/g, "\n")
        .replace(/<[^>]*>/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}
