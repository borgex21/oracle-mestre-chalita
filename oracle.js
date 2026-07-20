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

      const k = (year - 2000 + 0.25) * 12.3685;
          const phase = ((k - Math.floor(k)) * 100) % 100;

      let season = '';
          if (month >= 3 && month <= 5) season = 'Primavera';
          else if (month >= 6 && month <= 8) season = 'Verao';
          else if (month >= 9 && month <= 11) season = 'Outono';
          else season = 'Inverno';

      return { phase, season, day, month, year };
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

    calculate(date) {
          const d = parseLocalDate(date);
          const patternIdx = d.getDate() % this.patterns.length;
          const behaviorIdx = d.getMonth() % this.microBehaviors.length;
          return {
                  pattern: this.patterns[patternIdx],
                  behavior: this.microBehaviors[behaviorIdx]
          };
    }
};

// Tiferet Engine (integration, heart center)
const TiferetEngine = {
    themes: [
          'integrar os opostos que estao no seu coracao agora',
          'sentir o que voce vem evitando sentir',
          'reconhecer a verdade que sua alma ja sabe',
          'equilibrar fazer e ser, sem sacrificar nenhum dos dois',
          'usar a vulnerabilidade como forca, nao como fraqueza',
          'mostrar o reflexo autentico, sem filtro social',
          'aprender com a ferida em vez de escondê-la',
          'aceitar a beleza que existe no desequilibrio atual',
          'aceitar o que nao pode ser mudado agora',
          'permanecer estavel no centro enquanto tudo ao redor gira'
        ],

    calculate(date) {
          const d = parseLocalDate(date);
          const themeIdx = d.getDate() % this.themes.length;
          return { theme: this.themes[themeIdx] };
    }
};

// Integrated Reading Generator
// Combina os 5 canais (Astrologia, Numerologia, Kabbalah, The Pattern, Tiferet)
// em UMA unica mensagem, sequencial e interligada: cada parte retoma
// explicitamente a anterior, terminando em uma sintese clara e especifica.
function generateIntegratedReading(date) {
    const astro = AstrologyEngine.calculate(date);
    const num = NumerologyEngine.calculate(date);
    const numMeaning = NumerologyEngine.meanings[num.total] || 'equilibrio entre polaridades';
    const kab = KabbalaEngine.calculate(date);
    const kabPath = KabbalaEngine.paths[kab.pathNum];
    const kabSefira = KabbalaEngine.sefirot[kab.activeSefira];
    const patt = ThePatternEngine.calculate(date);
    const tif = TiferetEngine.calculate(date);
    const dayOfWeek = getDayOfWeek(date);

  const seasonQuality = astro.season === 'Primavera' ? 'germinacao e recomeco'
        : astro.season === 'Verao' ? 'plenitude e forca bruta'
        : astro.season === 'Outono' ? 'colheita e soltura'
        : 'repouso e introversao';

  const paragrafos = [];

  paragrafos.push(
        '1) Contexto cosmico (Astrologia): hoje e ' + dayOfWeek + ', com a lua em ' + astro.phase.toFixed(0) + '% de um ciclo de ' + (astro.phase > 50 ? 'contracao' : 'expansao') + ', dentro da estacao de ' + astro.season.toLowerCase() + ' - tempo de ' + seasonQuality + '. Este e o pano de fundo energetico de tudo o que vem a seguir.'
      );

  paragrafos.push(
        '2) Isso se conecta com o numero do dia (Numerologia): ' + num.total + ', resultado de ' + num.dayNum + ' + ' + num.monthNum + ' + ' + num.yearNum + ', cuja energia dominante e ' + numMeaning + '. Ou seja, de forma especifica: o momento de ' + seasonQuality + ' descrito acima se expressa concretamente atraves de ' + numMeaning + '.'
      );

  paragrafos.push(
        '3) Combinado a isso, o caminho ativo na Arvore da Vida (Kabbalah) e ' + kabPath + ', com a Sefira ' + kab.activeSefira + ' em destaque - ' + kabSefira + '. Na pratica, isso significa que o numero ' + num.total + ' se manifesta hoje atraves da qualidade de ' + kab.activeSefira + '.'
      );

  paragrafos.push(
        '4) No plano do comportamento observavel (The Pattern), tudo isso aparece como: ' + patt.pattern + '. O sinal concreto para voce identificar hoje e: ' + patt.behavior + '. Se isso acontecer, e a confirmacao direta de que a lua, o numero ' + num.total + ' e a Sefira ' + kab.activeSefira + ' estao atuando em voce agora - nao e coincidencia.'
      );

  paragrafos.push(
        '5) Sintese final (Tiferet): juntando os quatro pontos acima, o convite especifico e direto de hoje e ' + tif.theme + '. Nao e um conceito abstrato - e uma acao concreta possivel ainda hoje, ligada diretamente ao sinal do item 4 (' + patt.behavior + '). Pergunta objetiva para responder agora, sem rodeios: o que muda se voce agir a partir desse convite, em vez de repetir a reacao de sempre?'
      );

  return paragrafos.join('\n\n');
}

// Main Oracle Component
function OracleMestreChalita() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [reading, setReading] = useState(null);
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
                                                                     message: generateIntegratedReading(selectedDate)
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

  return (
        <div className="oracle-app">
          <header className="oracle-header">
            <h1>Oracle</h1>
          <p>Mestre Chalita - Leitura Holistica Integrada</p>
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

          <div className="channel-content">
              <div className="reading-section">
                <div className="section-title">Leitura Integrada - 5 Pilares</div>
{reading.message ? (
                  reading.message.split('\n\n').map((paragrafo, idx) => (
                                      <p key={idx} className="reading-text" style={{ marginBottom: '1rem' }}>
                                                    {paragrafo}
                                                    </p>
                                                                    ))
                ) : (
                                  <p className="reading-text">Esta leitura foi salva no formato antigo. Gere uma nova leitura para ver a versao integrada.</p>
               )}
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
