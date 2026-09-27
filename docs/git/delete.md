# Suppression de commits

## Git reset

Annuler des commits en gardant les modifications (elles repassent en non indexées).

```bash
git reset HEAD~x # revient x commits en arrière
git reset <commit> # revient à un commit précis
```

Annuler des commits en supprimant définitivement les modifications.

```bash
git reset --hard HEAD~x
git reset --hard <commit>
```

Avant :

```mermaid
gitGraph
   commit id: "A"
   commit id: "B"
   commit id: "C (à annuler)"
```

Après `git reset --hard B` :

```mermaid
gitGraph
   commit id: "A"
   commit id: "B"
```

## Git revert

Annuler un commit précis en créant un nouveau commit qui inverse ses changements, sans réécrire l'historique :

```bash
git revert <commit>
```

Avec `revert`, l'historique reste intact : un nouveau commit vient simplement annuler les changements du commit visé, sans rien supprimer :

```mermaid
gitGraph
   commit id: "A"
   commit id: "B"
   commit id: "C (à annuler)"
   commit id: "C' - revert de C"
```

::: tip Astuce
C'est la méthode à privilégier dès que le commit a été pushé ou partagé avec d'autres personnes, car elle ne casse pas l'historique commun et ne nécessite pas de force-push.
:::

Forcer le push après une réécriture d'historique (reset, rebase...) :

```bash
git push --force
```

::: warning Attention
Écrase l'historique distant : à utiliser avec précaution, surtout sur une branche partagée.
:::
