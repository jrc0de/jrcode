# Le compilateur

## Installation

Le compilateur TypeScript (`tsc`) s'installe globalement via Bun, ce qui rend la commande `tsc` disponible directement dans le terminal.

```bash
bun add -g typescript
```

::: tip Astuce
Bun peut exécuter directement des fichiers `.ts` sans compilation préalable (`bun run fichier.ts`), mais il ne fait alors aucune vérification de type : il se contente de retirer les annotations. Pour profiter de la vérification de types, il faut passer par `tsc`.
:::

## Compilation d'un fichier

`tsc` transforme un fichier `.ts` en `.js`, en supprimant les annotations de type au passage.

```bash
tsc file.ts # Génère file.js
```

## Création du `tsconfig.json`

Le fichier `tsconfig.json` centralise la configuration du compilateur pour tout un projet. Il se crée avec la commande `tsc --init`. Une fois ce fichier présent, la commande `tsc` (sans argument) compile tout le projet selon sa configuration dont nous allons étudier les options.

::: tip Astuce
Ajouter `--watch` à la commande `tsc` pour surveiller les fichiers et recompiler automatiquement à chaque modification.
:::

## Options de langage et d'environnement

| Option   | Description                                                                                                                                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `target` | Version d'ECMAScript vers laquelle TypeScript compile le code (`ES2020`, `ES2022`, `ESNext`...). Plus la valeur est récente, plus le code généré peut utiliser des fonctionnalités JS modernes, au prix d'une compatibilité moindre. |
| `lib`    | Liste les bibliothèques de définitions de types à inclure en plus de celles disponibles par défaut.                                                                                                                                  |

## Options des modules

| Option    | Description                                                                                                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `module`  | Définit quel système d'import/export TypeScript utilise dans le fichier `.js` généré (`CommonJS`, `ESNext`, `NodeNext`...). Doit être cohérent avec l'environnement d'exécution (Node.js, navigateur, bundler...). |
| `rootDir` | Dossier racine des fichiers sources `.ts`. Sert de référence pour reconstituer l'arborescence des fichiers compilés dans `outDir`.                                                                                 |

## Options du JavaScript

| Option    | Description                                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `allowJs` | Autorise l'inclusion de fichiers `.js` dans la compilation, en plus des fichiers `.ts`. Utile pour migrer progressivement un projet JS vers TS.  |
| `checkJs` | Active la vérification de types sur les fichiers `.js` (nécessite `allowJs`). Permet de détecter des erreurs dans du JS sans le convertir en TS. |

## Options d'émission

| Option           | Description                                                                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `outDir`         | Dossier de destination des fichiers `.js` générés après compilation.                                                                                                                      |
| `sourceMap`      | Génère des fichiers `.js.map` faisant le lien entre le code compilé et le code source `.ts`. Utile pour le débogage dans le navigateur ou un IDE.                                         |
| `removeComments` | Supprime les commentaires du fichier `.ts` dans le code `.js` généré.                                                                                                                     |
| `noEmit`         | Empêche `tsc` de générer des fichiers de sortie. Utile pour utiliser TypeScript uniquement comme vérificateur de types (par exemple avec Bun ou un bundler qui gère déjà la compilation). |
| `noEmitOnError`  | Empêche la génération des fichiers de sortie si une erreur de type est détectée.                                                                                                          |

## Options de vérification

| Option                       | Description                                                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `strict`                     | Active un ensemble de vérifications de types strictes (`strictNullChecks`, `noImplicitAny`...). **Fortement conseillé**, surtout sur un nouveau projet. |
| `noUnusedLocals`             | Signale une erreur pour toute variable locale déclarée mais jamais utilisée.                                                                            |
| `noUnusedParameters`         | Signale une erreur pour tout paramètre de fonction déclaré mais jamais utilisé.                                                                         |
| `noFallthroughCasesInSwitch` | Signale une erreur si un `case` d'un `switch` n'a ni `break`, ni `return`, ni `throw`, évitant les enchaînements de cas involontaires.                  |
