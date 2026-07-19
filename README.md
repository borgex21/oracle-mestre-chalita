# Oracle Mestre Chalita

Leitura holística com 5 pilares integrados: Astrologia, Numerologia, Kabbalah, The Pattern, Tiferet.

## Características

- **5 Canais de Leitura**: Cada pilar oferece perspectiva única — clima coletivo, leitura pessoal, espelho
- **Armazenamento Local**: localStorage para persistência de leituras — seu histórico privado
- **Design Luxuoso**: Cormorant Garamond + paleta ouro/cream em fundo escuro
- **Responsivo**: Funciona em desktop, tablet, mobile
- **Sem Dependências Externas**: Apenas React CDN — nenhum build process necessário

## Deployment em GitHub Pages

### 1. Clonar ou Criar

```bash
git clone https://github.com/borgex21/oracle-mestre-chalita.git
cd oracle-mestre-chalita
```

Ou criar novo repositório:

```bash
mkdir oracle-mestre-chalita
cd oracle-mestre-chalita
git init
```

### 2. Estrutura de Arquivos

```
oracle-mestre-chalita/
├── _config.yml           # Configuração Jekyll
├── index.html            # App principal
├── assets/
│   ├── styles.css        # Estilos globais
│   └── oracle.js         # Lógica das 5 channels
└── README.md             # Este arquivo
```

### 3. Push para GitHub

```bash
git add .
git commit -m "Initial Oracle deployment"
git remote add origin https://github.com/borgex21/oracle-mestre-chalita.git
git branch -M main
git push -u origin main
```

### 4. Ativar GitHub Pages

- Vá para **Settings > Pages**
- Source: `main` branch
- Click Save

Seu app estará disponível em: `https://borgex21.github.io/oracle-mestre-chalita`

## Customização

### Cores

Edite `/assets/styles.css`:

```css
:root {
    --gold: #d4af37;      /* Cor primária */
    --dark: #0f0e0e;      /* Fundo */
    --cream: #f5f1e8;     /* Highlight */
    --accent: #8b7355;    /* Texto secundário */
}
```

### Adicionando Leituras Personalizadas

Edite `/assets/oracle.js` e adicione novos "meanings" ou "patterns":

```javascript
const MyNewEngine = {
    generateReading: (date) => {
        return "Sua leitura aqui";
    }
};
```

## Histórico Local

Todas as leituras são armazenadas em `localStorage` do seu navegador — privado, sem servidor.

Para exportar seu histórico manualmente, abra DevTools (F12) e execute:

```javascript
JSON.stringify(localStorage.getItem('oracle-readings'), null, 2)
```

## Estrutura de Dados (Leitura)

```json
{
    "2026-07-19": {
        "date": "2026-07-19",
        "dayOfWeek": "Saturday",
        "timestamp": "2026-07-19T14:30:00.000Z",
        "channels": {
            "astrology": {
                "collective": "Fase lunar...",
                "personal": "Para você...",
                "mirror": "Espelho..."
            },
            "numerology": { ... },
            "kabbalah": { ... },
            "pattern": { ... },
            "tiferet": { ... }
        }
    }
}
```

## Teclas de Atalho (Planejadas)

- `G` → Gerar leitura do dia
- `H` → Mostrar/ocultar histórico
- `D` → Dark/Light mode toggle (futuro)

## Roadmap

- [ ] Export em PDF com design luxuoso
- [ ] Sincronização com Google Drive
- [ ] Integração com Notion (save readings)
- [ ] Dark/Light mode toggle
- [ ] Análise de padrões ao longo do tempo
- [ ] Compartilhamento seguro de leituras

## Técnico

- **React 18** via CDN
- **localStorage API** para storage
- **Sem build tools** — funciona direto em browser
- **CORS-safe** — tudo local
- **Performance**: ~800ms geração de leitura (intencional — meditação)

## Licença

Privado. Uso pessoal de Diego Borges.

---

**Mestre Chalita** — Leitura honesta para quem quer se conhecer.
