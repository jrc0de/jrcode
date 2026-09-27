import { defineConfig } from "vitepress"
import { withMermaid } from "vitepress-plugin-mermaid"

export default withMermaid(
    defineConfig({
        head: [["link", { rel: "icon", href: "/favicon.ico" }]],
        title: "JRCode",
        description: "Web dev doc",
        appearance: "force-dark",
        vite: {
            optimizeDeps: {
                include: ["mermaid", "fastdom"],
            },
        },
        themeConfig: {
            logo: "/img/lightning.png",
            socialLinks: [{ icon: "github", link: "https://github.com/jrc0de" }],
            footer: {
                copyright: "© 2026 ⚡ JRCode",
            },
            nav: [
                {
                    text: "Langages",
                    items: [
                        { text: "JavaScript", link: "/javascript/variables" },
                        { text: "TypeScript", link: "/typescript/primitives" },
                        { text: "HTML", link: "/html/fondamentaux" },
                        { text: "CSS", link: "/css/introduction" },
                        { text: "SQL", link: "/sql/basiques" },
                        { text: "Markdown", link: "/markdown/basic" },
                        { text: "MEI", link: "/mei/introduction" },
                    ],
                },
                {
                    text: "Outils",
                    items: [
                        { text: "Bun", link: "/bun" },
                        { text: "Git", link: "/git/starting" },
                        { text: "Zsh", link: "/zsh" },
                        { text: "VSCode", link: "/vscode" },
                        { text: "Photopea", link: "/photopea" },
                    ],
                },
            ],

            docFooter: {
                prev: "Page précédente",
                next: "Page suivante",
            },
            outline: {
                label: "Sur cette page",
            },
            notFound: {
                title: "PAGE INTROUVABLE",
                quote: "On dirait que vous avez emprunté un lien rompu ou une page qui n'existe plus.",
                linkLabel: "Retour à l'accueil",
                linkText: "Retour à l'accueil",
                code: "404",
            },

            sidebar: {
                "/javascript/": [
                    {
                        text: "JavaScript",
                        items: [
                            { text: "Variables", link: "/javascript/variables" },
                            { text: "Opérateurs", link: "/javascript/operateurs" },
                            { text: "Structures de contrôle", link: "/javascript/structures" },
                            { text: "Fonctions", link: "/javascript/fonctions" },
                            { text: "Commentaires", link: "/javascript/commentaires" },
                        ],
                    },
                ],
                "/typescript/": [
                    {
                        text: "TypeScript",
                        items: [
                            { text: "Types primitifs", link: "/typescript/primitives" },
                            { text: "Types particuliers", link: "/typescript/special" },
                            { text: "Tableaux", link: "/typescript/arrays" },
                            { text: "Objets", link: "/typescript/objects" },
                            { text: "Fonctions", link: "/typescript/functions" },
                            { text: "Classes", link: "/typescript/classes" },
                            { text: "Assertions de type", link: "/typescript/assertions" },
                            { text: "Compilateur", link: "/typescript/compiler" },
                        ],
                    },
                ],
                "/html/": [
                    {
                        text: "HTML",
                        items: [
                            { text: "Fondamentaux", link: "/html/fondamentaux" },
                            { text: "Eléments", link: "/html/elements" },
                            { text: "Commentaires", link: "/html/commentaires" },
                        ],
                    },
                ],
                "/markdown/": [
                    {
                        text: "Markdown",
                        items: [
                            { text: "Syntaxe de base", link: "/markdown/basic" },
                            { text: "Syntaxe avancée", link: "/markdown/advanced" },
                        ],
                    },
                ],
                "/css/": [
                    {
                        text: "CSS",
                        items: [
                            { text: "Introduction", link: "/css/introduction" },
                            { text: "Styliser les textes", link: "/css/text" },
                            { text: "Divers", link: "/css/divers" },
                        ],
                    },
                ],
                "/sql/": [
                    {
                        text: "SQL",
                        items: [
                            { text: "Basiques", link: "/sql/basic" },
                            { text: "Types de données", link: "/sql/types" },
                        ],
                    },
                ],
                "/git/": [
                    {
                        text: "Git",
                        items: [
                            { text: "Initialisation", link: "/git/starting" },
                            { text: "Synchronisation", link: "/git/sync" },
                            { text: "Supressions", link: "/git/delete" },
                            { text: "Branches", link: "/git/branch" },
                        ],
                    },
                ],
                "/mei/": [
                    {
                        text: "MEI",
                        items: [
                            { text: "Introduction", link: "/mei/introduction" },
                            { text: "Portées et clés", link: "/mei/staves" },
                            { text: "Mesures", link: "/mei/measures" },
                            { text: "Notes et durées", link: "/mei/notes" },
                            { text: "Paroles", link: "/mei/lyrics" },
                            { text: "Mise en page", link: "/mei/layout" },
                        ],
                    },
                ],
            },
        },
    }),
)
