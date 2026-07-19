const { useState, useEffect, useCallback } = React;

// Utility: Day of week calculation
function getDayOfWeek(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
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
        const d = new Date(date);
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
        else if (month >= 6 && month <= 8) season = 'Verão';
        else if (month >= 9 && month <= 11) season = 'Outono';
        else season = 'Inverno';
        
        return { phase, season, day, month, year };
    },

    generateReading: (date) => {
        const calc = AstrologyEngine.calculate(date);
        const readings = [
            `Fase lunar em ${calc.phase.toFixed(0)}% – ciclo de ${calc.phase > 50 ? 'contração' : 'expansão'}. O fluxo energético do dia carrega a qualidade de ${calc.season.toLowerCase()}: período de ${calc.season === 'Primavera' ? 'germinação e recomeço' : calc.season === 'Verão' ? 'plenitude e força bruta' : calc.season === 'Outono' ? 'colheita e soltura' : 'repouso e introversão'}.`,
            `Movimentos subtis operam sob a superfície. Há uma qualidade ${calc.phase < 25 ? 'introspectiva' : calc.phase < 50 ? 'de construção' : calc.phase < 75 ? 'de abertura' : 'de fechamento'} no dia que convida à ${calc.phase > 50 ? 'consolidação' : 'iniciativa'}.`,
            `O padrão cíclico traz ${calc.season === 'Inverno' ? 'uma pausa necessária' : 'momentum contínuo'}. Você está em sincronia com um ritmo maior que se desdobra silenciosamente.`
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
        const d = new Date(date);
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
        1: 'liderança, iniciativa, novidade',
        2: 'receptividade, dualidade, equilíbrio',
        3: 'criatividade, expressão, comunicação',
        4: 'estrutura, estabilidade, construção',
        5: 'movimento, mudança, liberdade',
        6: 'harmonia, responsabilidade, serviço',
        7: 'introspecção, sabedoria, espiritualidade',
        8: 'poder, abundância, manifestação',
        9: 'conclusão, transformação, compaixão',
        11: 'intuição, iluminação, mediação',
        22: 'mestre construtor, grande empreendimento',
        33: 'mestre compassivo, sabedoria antiga'
    },

    generateReading: (date) => {
        const calc = NumerologyEngine.calculate(date);
        const meaning = NumerologyEngine.meanings[calc.total] || 'equilíbrio entre polaridades';
        
        return `Numerologia do dia: ${calc.total} (${calc.dayNum} + ${calc.monthNum} + ${calc.yearNum}). Energia dominante: ${meaning}. Este número reverbera através do dia como um lembrete de sua qualidade central.`;
    }
};

// Kabbalah Engine
const KabbalaEngine = {
    sefirot: {
        'Keter': 'coroa luminosa, origem sem forma',
        'Chokmah': 'o impulso criativo primordial',
        'Binah': 'entendimento estruturador, o receptáculo',
        'Chesed': 'misericórdia, expansão, generosidade',
        'Gevurah': 'rigor, severidade, discernimento',
        'Tiferet': 'beleza, coração, centro de integração',
        'Netzach': 'vitória, emoção, criatividade visceral',
        'Hod': 'esplendor, intelecto, comunicação',
        'Yesod': 'fundação, inconsciente, os sonhos',
        'Malkhuth': 'reino, manifestação, corpo'
    },

    paths: {
        1: 'Keter-Chokmah: impulso puro de ser',
        2: 'Chokmah-Binah: encontro do potencial e da forma',
        3: 'Binah-Chesed: descida da bênção estruturada',
        4: 'Chesed-Gevurah: balança entre ceder e discernir',
        5: 'Gevurah-Tiferet: o aperfeiçoamento do caráter',
        6: 'Tiferet-Netzach: coração encontra o desejo',
        7: 'Netzach-Hod: arte encontra razão',
        8: 'Hod-Yesod: palavra torna-se imagem',
        9: 'Yesod-Malkhuth: sonho encarna em ação'
    },

    calculate: (date) => {
        const d = new Date(date);
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
        
        return `Caminho do dia: ${path}. Sefira ativa: ${calc.activeSefira} — ${sefira}. Você navega uma topologia antiga que equilibra opostos e conduz à integridade.`;
    }
};

// The Pattern Engine (behavioral patterns, synchronicities, cycles)
const ThePatternEngine = {
    patterns: [
        'contração ritmada: o dia convida a um repouso controlado',
        'expansão suave: há espaço emergindo para novas possibilidades',
        'estabilidade aparente com tremores internos: o que parece fixo se move sutilmente',
        'sincronicidade em cadeia: coincidências carregam mensagem',
        'inversão de expectativas: o oposto do óbvio se revela verdadeiro',
        'acumulação silenciosa: pequenos movimentos preparam mudança grande',
        'clareza seguida de nebulosidade: compreensão e dúvida se alternam',
        'compressão do espaço: múltiplas camadas reveladas em instante',
        'liberação controlada: energias presas encontram saída',
        'retorno ao começo: ciclo se fecha e reinicia em nível novo'
    ],

    microBehaviors: [
        'você começa antes de estar pronto',
        'você demora para começar mesmo quando está pronto',
        'você escolhe o caminho conhecível sobre o mais direto',
        'você coloca eficiência antes de alinhamento',
        'você confunde movimento com progresso',
        'você confunde pausa com derrota',
        'você reconhece seu reflexo em outros e reage',
        'você nota detalhes que outros deixam passar',
        'você sente antes de entender',
        'você entende antes de sentir'
    ],

    generateReading(date) {
        const d = new Date(date);
        const patternIdx = d.getDate() % this.patterns.length;
        const behaviorIdx = d.getMonth() % this.microBehaviors.length;

        const pattern = this.patterns[patternIdx];
        const behavior = this.microBehaviors[behaviorIdx];
        
        return `Padrão do dia: ${pattern}. Gatilho comportamental observável: ${behavior}. O que você notou sobre você mesmo hoje? Esta é a sincronicidade em ação.`;
    }
};

// Tiferet Engine (integration, heart center)
const TiferetEngine = {
    themes: [
        'integração de opostos no coração',
        'o que você vem fugindo de sentir',
        'a verdade que sua alma já sabe',
        'o ponto de equilíbrio entre fazer e ser',
        'a vulnerabilidade como força',
        'o reflexo autêntico sem filtro social',
        'a ferida que ensina',
        'a beleza no desequilíbrio',
        'a aceitação do que não pode ser mudado',
        'o centro que permanece imóvel enquanto tudo gira'
    ],

    generateReading(date) {
        const d = new Date(date);
        const themeIdx = d.getDate() % this.themes.length;
        const theme = this.themes[themeIdx];
        
        return `Tiferet te convida hoje a: ${theme}. Não como conceito abstrato, mas como presença corporal no seu peito. O que está acontecendo em você agora?`;
    }
};

// Main Oracle Component
function OracleMestreChalita() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [reading, setReading] = useState(null);
    const [activeChannel, setActiveChannel] = useState('astrology');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        setHistory(OracleStorage.getHistory());
    }, []);

    const generateReading = useCallback(() => {
        setLoading(true);
        
        setTimeout(() => {
            const dayOfWeek = getDayOfWeek(selectedDate);
            
            const readingData = {
                date: selectedDate,
                dayOfWeek: dayOfWeek,
                channels: {
                    astrology: {
                        collective: AstrologyEngine.generateReading(selectedDate),
                        personal: `Para você, Diego, esta qualidade ${dayOfWeek === 'Sunday' ? 'de repouso' : dayOfWeek === 'Saturday' ? 'de integração' : 'de movimento'} traz um espelho.`,
                        mirror: 'O que sua energia cósma está te pedindo para soltar hoje?'
                    },
                    numerology: {
                        collective: NumerologyEngine.generateReading(selectedDate),
                        personal: `Este número pulsa em seu corpo como um tambor. Que ação ele te incita?`,
                        mirror: 'Como você viveria este dia se confiasse totalmente no ritmo que o número sugere?'
                    },
                    kabbalah: {
                        collective: KabbalaEngine.generateReading(selectedDate),
                        personal: `Você está neste caminho há muito tempo, mesmo sem nomes. Reconheça o lugar onde está.`,
                        mirror: 'Qual Sefira você vem evitando? E se fosse hora de conhecê-la?'
                    },
                    pattern: {
                        collective: ThePatternEngine.generateReading(selectedDate),
                        personal: `Seus comportamentos recorrentes carregam sabedoria. O que eles estão te dizendo?`,
                        mirror: 'Você está pronto para interromper o loop ou vai deixá-lo girar mais uma volta?'
                    },
                    tiferet: {
                        collective: TiferetEngine.generateReading(selectedDate),
                        personal: `Seu coração conhece a verdade antes da mente. Sinta antes de interpretar.`,
                        mirror: 'O que você precisa perdoar em si mesmo neste momento?'
                    }
                }
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
                <p>Mestre Chalita — Leitura Holística</p>
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
                        {reading.dayOfWeek} — {new Date(reading.date).toLocaleDateString('pt-BR')}
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
                            <div className="section-title">Para Você</div>
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
                    <h3>Histórico</h3>
                    <ul className="history-list">
                        {history.slice(0, 10).map(date => (
                            <li key={date} className="history-item">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span onClick={() => loadReading(date)}>
                                        {new Date(date).toLocaleDateString('pt-BR')} — {getDayOfWeek(date)}
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
                                        ✕
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <footer className="oracle-footer">
                <p>Oracle Mestre Chalita — 5 Pilares de Integração</p>
                <p>Astrologia • Numerologia • Kabbalah • The Pattern • Tiferet</p>
            </footer>
        </div>
    );
}

// Render
ReactDOM.render(<OracleMestreChalita />, document.getElementById('app'));
