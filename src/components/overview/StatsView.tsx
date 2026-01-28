import { useMemo } from "react";
import {
  Flame,
  Library,
  Clock,
  TrendingUp,
  Calendar as CalendarIcon
} from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import type { Deck, Card } from "./types";

interface StatsViewProps {
  isLocked: boolean;
  decks?: Deck[];
}

const KPI_CARD = ({ title, value, icon: Icon, subtext, color }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-start justify-between hover:border-zinc-700 transition-colors">
    <div>
      <p className="text-zinc-400 text-sm font-medium mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-white mb-1">{value}</h4>
      <p className="text-xs text-zinc-500">{subtext}</p>
    </div>
    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
      <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

const ActivityHeatmap = ({ activityDates }: { activityDates: Set<string> }) => {
  const getIntensityClass = (dateStr: string) => {
    if (activityDates.has(dateStr)) return "bg-emerald-500";
    return "bg-zinc-800/50";
  };

  const weeks = useMemo(() => {
    const weeksArr = [];
    const today = new Date();
    for (let i = 20; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7 + today.getDay()));
      const days = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + d);
        days.push(day.toISOString().split('T')[0]);
      }
      weeksArr.push(days);
    }
    return weeksArr;
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-[315px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-zinc-400" />
          Atividade Recente
        </h3>
        <span className="text-xs text-zinc-500">Últimos meses</span>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, colIndex) => (
          <div
            key={colIndex}
            className={`${colIndex < 9 ? "hidden md:flex" : "flex"} flex-col gap-1`}
          >
            {week.map((dateStr, rowIndex) => (
              <div
                key={rowIndex}
                title={dateStr}
                className={`w-5 h-5 rounded-sm ${getIntensityClass(dateStr)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500">
        <span>Menos</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-zinc-800/50" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
        </div>
        <span>Mais</span>
      </div>
    </div>
  );
}

const COLORS = ['#9ca3af', '#3b45f2', '#10b981'];

const StatsView = ({ isLocked, decks = [] }: StatsViewProps) => {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const allCards: Card[] = decks.flatMap(d => d.cards);

    let newCount = 0;
    let learningCount = 0;
    let matureCount = 0;

    const activityDates = new Set<string>();

    allCards.forEach(card => {
      if (!card.lastReviewed) {
        newCount++;
      } else {
        if (card.difficulty === 'easy') {
          matureCount++;
        } else {
          learningCount++;
        }

        if (card.lastReviewed instanceof Date) {
          activityDates.add(card.lastReviewed.toISOString().split('T')[0]);
        } else if (typeof card.lastReviewed === 'string') {
          activityDates.add(new Date(card.lastReviewed).toISOString().split('T')[0]);
        }
      }
    });

    const forecastMap = new Map<string, number>();
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      forecastMap.set(d.toISOString().split('T')[0], 0);
    }

    allCards.forEach(card => {
      if (card.nextReviewDate) {
        const dateStr = new Date(card.nextReviewDate).toISOString().split('T')[0];
        if (forecastMap.has(dateStr)) {
          forecastMap.set(dateStr, (forecastMap.get(dateStr) || 0) + 1);
        }
      }
    });

    const forecastData = Array.from(forecastMap.entries()).map(([dateStr, count]) => {
      const date = new Date(dateStr);
      return {
        dateStr,
        name: date.toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'UTC' }),
        cards: count
      };
    }).sort((a, b) => a.dateStr.localeCompare(b.dateStr));


    return {
      totalCards: allCards.length,
      studiedCount: learningCount + matureCount,
      distribution: [
        { name: 'Novos', value: newCount },
        { name: 'Aprendendo', value: learningCount },
        { name: 'Aprendidos', value: matureCount }
      ],
      forecast: forecastData,
      activityDates,
      streak: 0
    };
  }, [decks]);

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in py-12">
        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-zinc-800 shadow-xl shadow-black/20">
          <TrendingUp className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">
          Desbloqueie seu Potencial
        </h2>
        <p className="text-zinc-400 max-w-md mb-8 text-lg">
          Visualize seu progresso, mantenha o foco e otimize seu aprendizado com estatísticas detalhadas.
        </p>
        <Button size="lg" className="px-8 text-lg" onClick={() => navigate("/login")}>
          Começar Agora
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPI_CARD
          title="Total de Cards"
          value={stats.totalCards.toString()}
          icon={Library}
          color="bg-blue-500"
          subtext="Em todos os decks"
        />
        <KPI_CARD
          title="Cards Estudados"
          value={stats.studiedCount.toString()}
          icon={Flame}
          color="bg-orange-500"
          subtext="Pelo menos 1 revisão"
        />
        <KPI_CARD
          title="Previsão 7 Dias"
          value={stats.forecast.reduce((acc, curr) => acc + curr.cards, 0).toString()}
          icon={Clock}
          color="bg-purple-500"
          subtext="Revisões acumuladas"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityHeatmap activityDates={stats.activityDates} />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-lg font-semibold text-white mb-4 w-full text-left">Distribuição do Baralho</h3>
          <div className="w-full h-[200px] text-xs mb-5">
            {stats.totalCards > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.distribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#e4e4e7' }}
                  />
                  <Legend verticalAlign="bottom" height={1} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500">
                Sem dados ainda
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Previsão de Revisões (7 Dias)</h3>
        </div>
        <div className="w-full h-[250px] text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.forecast}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#71717a' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#71717a' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: '#27272a' }}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#e4e4e7' }}
              />
              <Bar
                dataKey="cards"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
