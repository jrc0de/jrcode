# Fondamentaux

## Definitions

### Les éléments

Un élément HTML est composé d'une balise ouvrante, d'un contenu et d'une balise fermante. Certains éléments sont **auto-fermants** (ils n'ont pas de contenu).

```html
<p>Ceci est un paragraphe</p>
<input type="text" />
```

### Les attributs

Un attribut apporte des informations supplémentaires à un élément. Il se place dans la balise ouvrante sous la forme `nom="valeur"`. Ici `lang` est un attribut de l'élément `<html>`.

```html
<html lang="fr">
  ...
</html>
```

### L'imbrication

Les éléments peuvent être imbriqués les uns dans les autres. L'élément contenu est appelé **enfant**, l'élément contenant est appelé **parent**.

```html
<ul>
  <li>Élément 1</li>
  <li>Élément 2</li>
</ul>
```

## Structure de base

Tout code HTML doit être contenu entre les balises `<html>` et obligatoirement contenir les sections `<head>` et `<body>`.

```html
<!-- Indique au navigateur que le document est en HTML5 -->
<!DOCTYPE html>
<!-- L'attribut lang indique la langue de la page -->
<html lang="fr">
  <head>
    <!-- Encodage des caractères (nécessaire pour les accents) -->
    <meta charset="UTF-8" />
    <!-- Adaptation de l'affichage sur mobile -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Titre du document (visible dans les onglets des navigateurs) -->
    <title>Accueil</title>
  </head>
  <body>
    <!-- Les élements constitutifs de la page sont dans cette section -->
  </body>
</html>
```
