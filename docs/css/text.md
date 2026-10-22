# Styliser les textes

## Propriété _font-size_

La propriété `font-size` définit la taille du texte. Elle peut être exprimée dans différentes unités :

```css
p {
  font-size: 16px; /* taille fixe en pixels */
  font-size: 1.2rem; /* relative à la taille de police du <html> */
  font-size: 1.2em; /* relative à la taille de police du parent */
  font-size: 120%; /* relative à la taille de police du parent (en %) */
}
```

:::tip Astuce
Il est recommandé d'utiliser `rem` plutôt que `px` pour la taille du texte : ça permet de respecter les préférences d'accessibilité de l'utilisateur (zoom, taille de police par défaut du navigateur).
:::

## Propriété _font-family_

La propriété `font-family` définit la police utilisée pour le texte. On lui donne généralement une **liste de polices** séparées par des virgules, du plus au moins prioritaire, au cas où la première ne serait pas disponible sur l'appareil de l'utilisateur. La dernière valeur est en général une police **générique** (`serif`, `sans-serif`, `monospace`...), qui sert de solution de secours garantie par le navigateur.

```css
p {
  font-family: "Helvetica Neue", Arial, sans-serif;
}
```

:::tip Astuce
Un nom de police contenant des espaces doit être entouré de guillemets (ex. `"Source Serif"`), contrairement à un nom en un seul mot (ex. `Arial`).
:::

## Polices personnalisées

```css
@font-face {
  font-family: "Source Serif";
  src: url("fonts/source-serif-4-regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

## Propriété _text-transform_

La propriété `text-transform` permet de modifier automatiquement la casse du texte à l'affichage, sans avoir à changer le texte source (utile pour rester cohérent avec le HTML/contenu original, par exemple pour l'accessibilité ou le référencement).

```css
p {
  text-transform: uppercase; /* TOUT EN MAJUSCULES */
  text-transform: lowercase; /* tout en minuscules */
  text-transform: capitalize; /* Première Lettre En Majuscule */
  text-transform: none; /* aucune transformation (valeur par défaut) */
}
```

## Propriété _font-style_

La propriété `font-style` permet d'afficher le texte en italique.

```css
p {
  font-style: normal; /* pas d'italique (valeur par défaut) */
  font-style: italic; /* italique */
}
```

## Propriété _line-height_

La propriété `line-height` définit la hauteur d'une ligne de texte, c'est-à-dire l'espace vertical entre les lignes (aussi appelé "interlignage").

```css
p {
  line-height: 1.5; /* valeur sans unité (recommandé) */
  line-height: 24px; /* valeur fixe en pixels */
  line-height: 150%; /* pourcentage de la taille de police */
  line-height: normal; /* valeur par défaut (dépend de la police, ~1.2) */
}
```

:::tip Astuce
Privilégier une valeur sans unité relative à la `font-size` de l'élément lui-même. Elle se recalcule correctement si un élément enfant a une taille de police différente. Une valeur entre `1.4` et `1.6` convient généralement bien pour du texte courant.
:::

## Propriété _text-align_

La propriété `text-align` définit l'alignement horizontal du texte à l'intérieur de son conteneur.

```css
p {
  text-align: left; /* aligné à gauche */
  text-align: right; /* aligné à droite */
  text-align: center; /* centré */
  text-align: justify; /* justifié (aligné à gauche ET à droite) */
}
```
