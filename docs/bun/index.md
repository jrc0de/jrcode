# Bun

## Commandes essentielles

- `bun -v` : afficher la version
- `bun upgrade` : mettre à jour Bun vers la dernière version
- `bun init` : initialiser un nouveau projet
- `bun install` : installer les dépendances d'un projet
- `bun i` : alias de `bun install`

## Gestion des packages

- `bun add [package]` : installer un package
- `bun add [package] -d` : installer en dépendance de développement
- `bun outdated` : lister les packages obsolètes
- `bun update` : mettre à jour
- `bun update --latest` : mettre à jour en ignorant les contraintes de version
- `bun remove [package]` : désinstaller
- `bun add [package]@latest` : installer ou forcer la dernière version

## Gestion des packages globaux

- `bun add -g [package]` : installer
- `bun update -g [package]` : mettre à jour
- `bun remove -g [package]` : désinstaller
- `bun outdated -g` : lister les packages obsolètes
- `bun pm ls -g` : lister les packages avec leur version
- `bun pm bin -g` : afficher le dossier bin global (où sont les exécutables)
- `ls $(bun pm bin -g)` : lister les commandes (binaires) disponibles

::: info Package vs binaire
Le nom du package installé n'est pas toujours celui de la commande qu'il expose. Par exemple, `bun add -g typescript` installe le package `typescript`, mais crée la commande `tsc`.
:::

## Exécution de scripts

- `bun [script.js]` : exécuter un script
- `bunx [package]` : exécuter un package sans l'installer
- `bunx serve` : lancer un serveur statique local

## Sécurité

- `bun audit` : scanner les vulnérabilités de sécurité
- `bun audit fix` : corriger les vulnérabilités de sécurité

## Nettoyage

- `bun prune` : supprimer les packages non référencés de `node_modules`
- `bun prune --production` : supprimer aussi les devDependencies de `node_modules`

## Tests

- `bun test` : lancer la suite de tests
- `bun test [file]` : lancer les tests d'un fichier précis
