const { useState, useEffect, useCallback } = React;

// Utility: Parse a YYYY-MM-DD string as a local date (avoids UTC off-by-one bugs)
function parseLocalDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

// Utility: Day of week calculation (em portugues, para consistencia com o resto da UI)
function getDayOfWeek(date) {
    const days = ['Domingo', 'Segunda-feira', 'Terca-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado'];
    return days[parseLocalDate(date).getDay()];
}

// Storage API wrapper
class OracleStorage {
    static key = 'oracle-readings';

static saveReading(date, data) {
    const readings = this.getAllReadings();
    readings[date] = { ...data, timestamp: new Date().toISOString() };
    localStorage.setItem(this.key, JSON.stringify(readings));
}

static getReading(date) {
    const readings = this.getAllReadings();
    return readings[date] || null;
}

static getAllReadings() {
    try {
        return JSON.parse(localStorage.getItem(this.key) || '{}');
    } catch {
        return {};
    }
}

static deleteReading(date) {
    const readings = this.getAllReadings();
    delete readings[date];
    localStorage.setItem(this.key, JSON.stringify(readings));
}

static getHistory() {
    return Object.keys(this.getAllReadings()).sort().reverse();
}
}

// Astrology Engine
const AstrologyEngine = {
    calculate: (date) => {
        const d = parseLocalDate(date);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();

    // Simplified lunar phase calculation
    const k = (year - 2000 + 0.25) * 12.3685;
        const jd = Math.floor(k) + 0.5;
        const phase = ((k - Math.floor(k)) * 100) % 100;

    // Season determination
    let season = '';
        if (month >= 3 && month <= 5) season = 'Primavera';
        else if (month >= 6 && month <= 8) season = 'Verao';
        else if (month >= 9 && month <= 11) season = 'Outono';
        else season = 'Inverno';

    return { phase, season, day, month, year };
    },

    generateReading: (date) => {
        const calc = AstrologyEngine.calculate(date);
        const readings = [
            `Fase lunar em ${calc.phase.toFixed(0)}% - ciclo de ${calc.phase > 50 ? 'contracao' : 'expansao'}. O fluxo energetico do dia carrega a qualidade de ${calc.season.toLowerCase()}: periodo de ${calc.season === 'Primavera' ? 'germinacao e recomeco' : calc.season === 'Verao' ? 'plenitude e forca bruta' : calc.season === 'Outono' ? 'colheita e soltura' : 'repouso e introversao'}.`,
            `Movimentos sutis operam sob a superficie. Ha uma qualidade ${calc.phase < 25 ? 'introspectiva' : calc.phase < 50 ? 'de construcao' : calc.phase < 75 ? 'de abertura' : 'de fechamento'} no dia que convida a ${calc.phase > 50 ? 'consolidacao' : 'iniciativa'}.`,
            `O padrao ciclico traz ${calc.season === 'Inverno' ? 'uma pausa necessaria' : 'momentum continuo'}. Voce esta em sincronia com um ritmo maior que se desdobra silenciosamente.`
            ];
        const seed = calc.day + calc.month + calc.year;
        return readings[seed % readings.length];
    }
};

// Numerology Engine
const NumerologyEngine = {
    reduceToSingle: (num) => {
        while (num >= 10 && num !== 11 && num !== 22 && num !== 33) {
            num = Math.floor(num / 10) + (num % 10);
        }
        return num;
    },

    calculate: (date) => {
        const d = parseLocalDate(date);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();

    const dayNum = NumerologyEngine.reduceToSingle(day);
        const monthNum = NumerologyEngine.reduceToSingle(month);
        const yearNum = NumerologyEngine.reduceToSingle(year);

    const total = NumerologyEngine.reduceToSingle(dayNum + monthNum + yearNum);

    return { dayNum, monthNum, yearNum, total };
    },

    meanings: {
        1: 'lideranca, iniciativa, novidade',
        2: 'receptividade, dualidade, equilibrio',
        3: 'criatividade, expressao, comunicacao',
        4: 'estrutura, estabilidade, construcao',
        5: 'movimento, mudanca, liberdade',
        6: 'harmonia, responsabilidade, servico',
        7: 'introspeccao, sabedoria, espiritualidade',
        8: 'poder, abundancia, manifestacao',
        9: 'conclusao, transformacao, compaixao',
        11: 'intuicao, iluminacao, mediacao',
        22: 'mestre construtor, grande empreendimento',
        33: 'mestre compassivo, sabedoria antiga'
    },

    generateReading: (date) => {
        const calc = NumerologyEngine.calculate(date);
        const meaning = NumerologyEngine.meanings[calc.total] || 'equilibrio entre polaridades';

    return `Numerologia do dia: ${calc.total} (${calc.dayNum} + ${calc.monthNum} + ${calc.yearNum}). Energia dominante: ${meaning}. Este numero reverbera atraves do dia como um lembrete de sua qualidade central.`;
    }
};

// Kabbalah Engine
const KabbalaEngine = {
    sefirot: {
        'Keter': 'coroa luminosa, origem sem forma',
        'Chokmah': 'o impulso criativo primordial',
        'Binah': 'entendimento estruturador, o receptaculo',
        'Chesed': 'misericordia, expansao, generosidade',
        'Gevurah': 'rigor, severidade, discernimento',
        'Tiferet': 'beleza, coracao, centro de integracao',
        'Netzach': 'vitoria, emocao, criatividade visceral',
        'Hod': 'esplendor, intelecto, comunicacao',
        'Yesod': 'fundacao, inconsciente, os sonhos',
        'Malkhuth': 'reino, manifestacao, corpo'
    },

    paths: {
        1: 'Keter-Chokmah: impulso puro de ser',
        2: 'Chokmah-Binah: encontro do potencial e da forma',
        3: 'Binah-Chesed: descida da bencao estruturada',
        4: 'Chesed-Gevurah: balanca entre ceder e discernir',
        5: 'Gevurah-Tiferet: o aperfeicoamento do carater',
        6: 'Tiferet-Netzach: coracao encontra o desejo',
        7: 'Netzach-Hod: arte encontra razao',
        8: 'Hod-Yesod: palavra torna-se imagem',
        9: 'Yesod-Malkhuth: sonho encarna em acao'
    },

    calculate: (date) => {
        const d = parseLocalDate(date);
        const day = d.getDate();
        const pathNum = (day % 9) || 9;
        const sefirotNum = (day % 10) || 10;
        const sefirotList = Object.keys(KabbalaEngine.sefirot);
        const activeSefira = sefirotList[sefirotNum - 1];

    return { pathNum, activeSefira };
    },

    generateReading: (date) => {
        const calc = KabbalaEngine.calculate(date);
        const path = KabbalaEngine.paths[calc.pathNum];
        const sefira = KabbalaEngine.sefirot[calc.activeSefira];

    return `Caminho do dia: ${path}. Sefira ativa: ${calc.activeSefira} - ${sefira}. Voce navega uma topologia antiga que equilibra opostos e conduz a integridade.`;
    }
};

// The Pattern Engine (behavioral patterns, synchronicities, cycles)
const ThePatternEngine = {
    patterns: [
        'contracao ritmada: o dia convida a um repouso controlado',
        'expansao suave: ha espaco emergindo para novas possibilidades',
        'estabilidade aparente com tremores internos: o que parece fixo se move sutilmente',
        'sincronicidade em cadeia: coincidencias carregam mensagem',
        'inversao de expectativas: o oposto do obvio se revela verdadeiro',
        'acumulacao silenciosa: pequenos movimentos preparam mudanca grande',
        'clareza seguida de nebulosidade: compreensao e duvida se alternam',
        'compressao do espaco: multiplas camadas reveladas em instante',
        'liberacao controlada: energias presas encontram saida',
        'retorno ao comeco: ciclo se fecha e reinicia em nivel novo'
        ],

    microBehaviors: [
        'voce comeca antes de estar pronto',
        'voce demora para comecar mesmo quando esta pronto',
        'voce escolhe o caminho conhecivel sobre o mais direto',
        'voce coloca eficiencia antes de alinhamento',
        'voce confunde movimento com progresso',
        'voce confunde pausa com derrota',
        'voce reconhece seu reflexo em outros e reage',
        'voce nota detalhes que outros deixam passar',
        'voce sente antes de entender',
        'voce entende antes de sentir'
        ],

    generateReading(date) {
        const d = parseLocalDate(date);
        const patternIdx = d.getDate() % this.patterns.length;
        const behaviorIdx = d.getMonth() % this.microBehaviors.length;

    const pattern = this.patterns[patternIdx];
        const behavior = this.microBehaviors[behaviorIdx];

    return `Padrao do dia: ${pattern}. Gatilho comportamental observavel: ${behavior}. O que voce notou sobre voce mesmo hoje? Esta e a sincronicidade em acao.`;
    }
};

// Tiferet Engine (integration, heart center)
const TiferetEngine = {
    themes: [
        'integracao de opostos no coracao',
        'o que voce vem fugindo de sentir',
        'a verdade que sua alma ja sabe',
        'o ponto de equilibrio entre fazer e ser',
        'a vulnerabilidade como forca',
        'o reflexo autentico sem filtro social',
        'a ferida que ensina',
        'a beleza no desequilibrio',
        'a aceitacao do que nao pode ser mudado',
        'o centro que permanece imovel enquanto tudo gira'
        ],

    generateReading(date) {
        const d = parseLocalDate(date);
        const themeIdx = d.getDate() % this.themes.length;
        const theme = this.themes[themeIdx];

    return `Tiferet te convida hoje para: ${theme}. Nao como conceito abstrato, mas como presenca corporal no seu peito. O que esta acontecendo em voce agora?`;
    }
};

// Synthesis Engine (integrates the 5 channels into a single unified reading)
const SynthesisEngine = {
    generateReading(channels) {
        const collective = [
            `Astrologia: ${channels.astrology.collective}`,
            `Numerologia: ${channels.numerology.collective}`,
            `Kabbalah: ${channels.kabbalah.collective}`,
            `The Pattern: ${channels.pattern.collective}`,
            `Tiferet: ${channels.tiferet.collective}`
            ].join(' ');

    const personal = 'Diego, quando os cinco pilares sao lidos como um so corpo, eles apontam para uma mesma direcao: o cosmos, o numero, o caminho simbolico, o padrao comportamental e o coracao convergem hoje em um unico convite. Confie na convergencia entre os canais mais do que em qualquer um isoladamente.';

    const mirror = 'Se astrologia, numerologia, Kabbalah, The Pattern e Tiferet concordam entre si, o que ainda falta para voce agir sobre o que ja sabe?';

    return { collective, personal, mirror };
    }
};

// Main Oracle Component
function OracleMestreChalita() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [reading, setReading] = useState(null);
    const [activeChannel, setActiveChannel] = useState('synthesis');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

useEffect(() => {
    setHistory(OracleStorage.getHistory());
}, []);

const generateReading = useCallback(() => {
    setLoading(true);

                                    setTimeout(() => {
                                        const dayOfWeek = getDayOfWeek(selectedDate);

                                               const channels = {
                                                   astrology: {
                                                       collective: AstrologyEngine.generateReading(selectedDate),
                                                       personal: `Para voce, Diego, esta qualidade ${dayOfWeek === 'Domingo' ? 'de repouso' : dayOfWeek === 'Sabado' ? 'de integracao' : 'de movimento'} traz um espelho.`,
                                                       mirror: 'O que sua energia cosmica esta te pedindo para soltar hoje?'
                                                   },
                                                   numerology: {
                                                       collective: NumerologyEngine.generateReading(selectedDate),
                                                       personal: `Este numero pulsa em seu corpo como um tambor. Que acao ele te incita?`,
                                                       mirror: 'Como voce viveria este dia se confiasse totalmente no ritmo que o numero sugere?'
                                                   },
                                                   kabbalah: {
                                                       collective: KabbalaEngine.generateReading(selectedDate),
                                                       personal: `Voce esta neste caminho ha muito tempo, mesmo sem nomes. Reconheca o lugar onde esta.`,
                                                       mirror: 'Qual Sefira voce vem evitando? E se fosse hora de conhece-la?'
                                                   },
                                                   pattern: {
                                                       collective: ThePatternEngine.generateReading(selectedDate),
                                                       personal: `Seus comportamentos recorrentes carregam sabedoria. O que eles estao te dizendo?`,
                                                       mirror: 'Voce esta pronto para interromper o loop ou vai deixa-lo girar mais uma volta?'
                                                   },
                                                   tiferet: {
                                                       collective: TiferetEngine.generateReading(selectedDate),
                                                       personal: `Seu coracao conhece a verdade antes da mente. Sinta antes de interpretar.`,
                                                       mirror: 'O que voce precisa perdoar em si mesmo neste momento?'
                                                   }
                                               };

                                               channels.synthesis = SynthesisEngine.generateReading(channels);

                                               const readingData = {
                                                   date: selectedDate,
                                                   dayOfWeek: dayOfWeek,
                                                   channels
                                               };

                                               OracleStorage.saveReading(selectedDate, readingData);
                                        setReading(readingData);
                                        setHistory(OracleStorage.getHistory());
                                        setLoading(false);
                                    }, 800);
}, [selectedDate]);

const loadReading = (date) => {
    const stored = OracleStorage.getReading(date);
    if (stored) {
        setSelectedDate(date);
        setReading(stored);
    }
};

const deleteReading = (date) => {
    OracleStorage.deleteReading(date);
    setHistory(OracleStorage.getHistory());
    if (reading && reading.date === date) {
        setReading(null);
    }
};

const channelLabels = {
    synthesis: 'Sintese',
    astrology: 'Astrologia',
    numerology: 'Numerologia',
    kabbalah: 'Kabbalah',
    pattern: 'The Pattern',
    tiferet: 'Tiferet'
};

const currentChannel = reading && reading.channels[activeChannel];

return (
    <div className="oracle-app">
    <header className="oracle-header">
    <h1>Oracle</h1>
    <p>Mestre Chalita - Leitura Holistica</p>
    </header>

<section className="date-input-section">
    <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    />
        <button onClick={generateReading} disabled={loading}>
    {loading ? 'Gerando...' : 'Gerar Leitura'}
</button>
    </section>

{reading && (
    <div className="reading-container">
    <div className="reading-date">
{reading.dayOfWeek} - {parseLocalDate(reading.date).toLocaleDateString('pt-BR')}
</div>

<div className="tabs-nav">
{Object.keys(channelLabels).map(channel => (
    <button
                                key={channel}
className={`tab-button ${activeChannel === channel ? 'active' : ''}`}
onClick={() => setActiveChannel(channel)}
>
{channelLabels[channel]}
</button>
))}
</div>

<div className="channel-content">
    <div className="reading-section">
    <div className="section-title">Clima Coletivo</div>
<div className="reading-text">{currentChannel.collective}</div>
    </div>

<div className="divider"></div>

<div className="reading-section">
    <div className="section-title">Para Voce</div>
<div className="reading-text">{currentChannel.personal}</div>
    </div>

<div className="mirror-section">
    <div className="section-title">Espelho</div>
<div className="reading-text">{currentChannel.mirror}</div>
    </div>
    </div>
    </div>
)}

{loading && !reading && (
    <div className="reading-container">
    <div className="loading">
    <span>Consultando os pilares...</span>
    </div>
    </div>
 )}

{history.length > 0 && (
    <div className="history-sidebar">
    <h3>Historico</h3>
 <ul className="history-list">
{history.slice(0, 10).map(date => (
    <li key={date} className="history-item">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<span onClick={() => loadReading(date)}>
                          {parseLocalDate(date).toLocaleDateString('pt-BR')} - {getDayOfWeek(date)}
    </span>
<button
onClick={() => deleteReading(date)}
style={{
                                                                   background: 'none',
    border: 'none',
    color: 'var(--accent)',
    cursor: 'pointer',
    fontSize: '0.8rem'
}}
    >
x
    </button>
    </div>
    </li>
))}
    </ul>
    </div>
)}

<footer className="oracle-footer">
    <p>Oracle Mestre Chalita - 5 Pilares de Integracao</p>
<p>Astrologia - Numerologia - Kabbalah - The Pattern - Tiferet</p>
    </footer>
    </div>
);
    }

// Render
ReactDOM.render(<OracleMestreChalita />, document.getElementById('app'));
