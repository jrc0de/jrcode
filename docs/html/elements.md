# Les éléments HTML

## Titres

Les titres se déclinent sur six niveaux de profondeur de `h1` à `h6`.

```html
<h1>Titre principal</h1>
<h2>Titre secondaire</h2>
...
```

## Paragraphes

Les paragraphes sont définis par la balise `p`.

```html
<p>Ceci est un paragraphe...</p>
```

## Mise en forme

Le texte peut être mis en **gras** avec la balise `strong` et en _italique_ avec la balise `em`.

```html
<strong>Texte en gras</strong> <em>Texte en italique</em>
```

## Listes

Les listes non ordonnées utilisent la balise `ul` avec des éléments `li`, et les listes ordonnées la balise `ol`.

```html
<ul>
    <li>Élément de liste</li>
    <li>Autre élément</li>
</ul>

<ol>
    <li>Premier élément</li>
    <li>Deuxième élément</li>
</ol>
```

## Images

Les images sont insérées avec la balise `img`, qui est auto-fermante. Elle utilise plusieurs attributs essentiels.

```html
<img src="img/image.jpg" alt="Description de l'image" width="300" height="200" />
```

- `src` : chemin ou URL de l'image
- `alt` : texte alternatif (accessibilité et SEO)
- `width` / `height` : dimensions en pixels

## Liens

### L'élément `<a>`

Un lien hypertexte est créé avec la balise `<a>`. L'attribut `href` définit la destination du lien.

```html
<a href="https://monsite.com">Visiter mon site.</a>
```

### Types de liens

#### Liens absolus

Pointent vers une URL complète (protocole inclus). Utilisés pour les ressources externes.

```html
<a href="https://www.mozilla.org">Mozilla</a>
```

#### Liens relatifs

Pointent vers une ressource du même site, en partant de la page courante.

```html
<!-- Même dossier -->
<a href="contact.html">Contact</a>
<!-- Sous-dossier -->
<a href="blog/article.html">Un article</a>
<!-- Dossier parent -->
<a href="../index.html">Retour à l'accueil</a>
```

#### Liens d'ancre

Permettent de naviguer vers une section précise de la page via l'attribut `id`.

```html
<h2 id="section-contact">Contact</h2>

<a href="#section-contact">Aller au contact</a>
```

#### Liens mailto et tel

Pour ouvrir le client mail ou composer un appel téléphonique.

```html
<a href="mailto:contact@example.com">Nous écrire</a> <a href="tel:+33600000000">Nous appeler</a>
```

### Attributs courants

| Attribut   | Rôle                                                  |
| ---------- | ----------------------------------------------------- |
| `href`     | URL de destination (obligatoire)                      |
| `target`   | Contexte d'ouverture (`_blank` pour un nouvel onglet) |
| `title`    | Info-bulle au survol                                  |
| `download` | Force le téléchargement du fichier cible              |

```html
<!-- Ouvrir dans un nouvel onglet (+ sécurité) -->
<a href="https://example.com" target="_blank"> Ouvrir dans un nouvel onglet </a>

<!-- Télécharger un fichier -->
<a href="/files/rapport.pdf" download>Télécharger le rapport</a>
```

## Structuration sémantique

HTML5 introduit des éléments qui donnent du sens à l'organisation de la page, au-delà du simple découpage visuel.

Le `header` représente l'en-tête d'une page ou d'une section. Il contient généralement le logo, le titre du site et la navigation principale. Il peut apparaître plusieurs fois dans une page (en-tête du site, en-tête d'un `article`…).

Le `nav` regroupe les liens de navigation principaux du site ou de la page. Il est réservé aux blocs de navigation structurants — pas besoin d'y mettre chaque groupe de liens de la page.

Le `article` représente un contenu autonome et redistribuable : billet de blog, actualité, commentaire, fiche produit… Il doit avoir du sens sorti de son contexte, pour pouvoir être partagé ou syndiqué tel quel.

Le `footer` représente le pied de page d'une page ou d'une section. Il contient généralement les mentions légales, les liens secondaires ou les informations de contact. Comme `header`, il peut apparaître plusieurs fois dans une page.
