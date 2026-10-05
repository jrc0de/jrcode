# Syntaxe de base

## Paragraphes

Séparer deux paragraphes par une **ligne vide**.

```markdown
Mon premier paragraphe.

Mon second paragraphe, séparé par une ligne vide.
```

## Titres

```markdown
# Titre niveau 1

## Titre niveau 2

### Titre niveau 3

#### Titre niveau 4

##### Titre niveau 5

###### Titre niveau 6
```

## Emphase

```markdown
_italique_ ou _italique_
**gras**
**_gras et italique_**
```

## Listes non-ordonnées

```markdown
- Item 1
- Item 2
    - Sous-élément
```

## Listes ordonnées

```markdown
1. Premier point
2. Deuxième point
```

## Citations

```markdown
> Ceci est une citation
> qui peut s'étendre sur plusieurs lignes.
```

## Séparateur horizontal

```markdown
***
```

## Code inline

```markdown
`maVariable`
```

## Bloc de code avec coloration syntaxique

````markdown
```javascript
const hello = "Hello World"
console.log(hello)
```
````

## Liens simples

```markdown
[Texte du lien](https://example.com)
```

## Notes de bas de page

```markdown
Visiter mon [site][1]

[1]: https://monsite.fr
```

## Images

```markdown
![Texte alternatif](chemin/vers/image.png)
```

## Image avec titre

Un troisième argument optionnel, entre guillemets, ajoute un attribut `title` à l'image.

```markdown
![Texte alternatif](chemin/vers/image.png "Légende de l'image")
```

Génère :

```html
<img src="chemin/vers/image.png" alt="Texte alternatif" title="Légende de l'image" />
```
