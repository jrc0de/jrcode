# Introduction

## Structure de base

Une règle CSS utilise un sélecteur pour cibler un élément HTML. Le bloc de déclaration qui suit, entre accolades, contient une ou plusieurs déclarations sous forme de paires _propriété_ : _valeur_.

```css
h1 {
  font-family: "Source Serif";
  font-weight: 400;
  color: blue;
}
```

## CSS en ligne (inline)

Le style est appliqué directement sur un élément HTML via l'attribut `style`.

```html
<h1 style="color: blue; font-weight: 400;">Titre</h1>
```

## CSS interne

Le style est écrit dans une balise `<style>` placée dans le `<head>` du document HTML.

```html
<head>
  <style>
    h1 {
      font-family: "Source Serif";
      font-weight: 400;
      color: blue;
    }
  </style>
</head>
```

## CSS externe

Le style est écrit dans un fichier `.css` séparé, lié au document HTML via une balise `<link>` dans le `<head>`. Dans la pratique, on privilégie presque toujours le CSS externe pour organiser un projet proprement.

```html
<head>
  <link rel="stylesheet" href="styles.css" />
</head>
```

```css
/* styles.css */
h1 {
  font-family: "Source Serif";
  font-weight: 400;
  color: blue;
}
```
