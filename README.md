# Starky 🚀

O Starky é uma aplicação moderna e inteligente de flashcards projetada para ajudá-lo a dominar qualquer assunto através da repetição espaçada. Construído com uma estética em modo escuro, oferece uma experiência de estudo focada e imersiva.

![Tela Inicial](./public/screenshots/home.png)

## ✨ Principais Funcionalidades

- **🧠 Sistema de Repetição Espaçada (SRS)**: Algoritmo inteligente que agenda revisões com base em quão bem você conhece cada card (Fácil, Médio, Bom e Difícil).
- **🔊 Suporte a Áudio (TTS)**: Ouça a pronúncia dos cards em múltiplos idiomas (Inglês, Espanhol, Francês e Italiano), facilitando o aprendizado de línguas.
- **⌨️ Atalhos de Teclado**: Estude com mais agilidade usando atalhos dedicados:
  - `Espaço`: Ver resposta.
  - `1`, `2`, `3`, `4`: Avaliar dificuldade.
  - `S`: Ouvir o texto do card.
- **📊 Estatísticas Avançadas**: Acompanhe sua evolução com:
  - **Heatmap de Atividade**: Visualize seus dias seguidos de estudo.
  - **Gráfico de Forecast**: Previsão de revisões para os próximos 7 dias.
  - **Distribuição do Baralho**: Veja quantos cards estão em aprendizado ou dominados.
- **🌍 Biblioteca Comunitária**: Baixe decks prontos de idiomas (A1 ao C1) e outros temas diretamente para sua conta.
- **📂 Organização por Categorias**: Agrupe seus decks em categorias personalizadas para manter tudo organizado.
- **🔄 Importação de Decks**: Traga seus decks do Anki (.apkg) ou importe via JSON de forma simples.
- **🏆 Decks Dominados**: Decks com 100% de aproveitamento ganham destaque visual (efeito esmeralda), celebrando sua conquista.
- **☁️ Sincronização em Nuvem**: Todo o seu progresso, cards e estatísticas são salvos na nuvem para acesso em qualquer lugar.
- **🎨 UI Moderna**: Interface em Dark Mode, minimalista e focada, projetada para evitar a fadiga visual.
- **📱 Design Responsivo**: Estude pelo computador, tablet ou celular com interface totalmente adaptada.

## 🛠️ Tecnologias Utilizadas

- **Core**: React 18, TypeScript, Vite.
- **Estilização**: Tailwind CSS (Design System personalizado).
- **Visualização de Dados**: Recharts (Heatmap, Forecast e Distribuição).
- **Ícones**: Lucide React.
- **Persistência**: SQLite/Drizzle ORM (Backend) e sincronização via API.
- **Integração**: Importação nativa de arquivos do Anki (.apkg).

## 📖 Como Usar

1.  **Criar um Deck**: Clique em "Novo Deck" na barra lateral para criar uma coleção de cards.
2.  **Adicionar Cards**: Digite suas perguntas e respostas.
3.  **Estudar**: Clique em "Estudar" em um deck. Leia a pergunta, vire o card e avalie sua dificuldade.
4.  **Revisar**: O Starky trará de volta os cards que você achou difíceis mais cedo, enquanto empurra os fáceis para datas posteriores.

## 📝 Licença

Este projeto é open source e está disponível sob a [Licença MIT](LICENSE).

## 📝 Autor

- **Felipe Soares** - [GitHub](https://github.com/felipesoarws) / [LinkedIn](https://www.linkedin.com/in/felipesoarws/)
