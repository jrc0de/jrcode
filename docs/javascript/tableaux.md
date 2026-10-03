# Les tableaux

Les tableaux sont des listes ordonnées de valeurs accessibles par index (commence à 0).
En JavaScript, un tableau est un **objet** spécial.

```js
const alphabet = ["a", "b", "c"]

alphabet[0] // "a"
alphabet[2] = "d" // ["a", "b", "d"]
alphabet.length // 3
```

## Méthodes utiles

```js
const alphabet = ["a", "b", "c"]

alphabet.push("d") // ['a', 'b', 'c', 'd']
alphabet.pop() // ['a', 'b', 'c']
alphabet.unshift("z") // ['z', 'a', 'b', 'c']
alphabet.shift() // ['a', 'b', 'c']
alphabet.indexOf("c") // 2
alphabet.includes("z") // false
```

## Destructuring de tableau

Le destructuring permet d'**extraire des valeurs** d'un tableau et de les assigner directement à des variables. On extrait les valeurs **par position** :

```js
const alphabet = ["alpha", "bravo", "charlie"]

const [a, b, c] = alphabet
// a = "alpha", b = "bravo", c = "charlie"
```

On peut **sauter** des éléments avec une virgule :

```js
const [a, , c] = alphabet
// a = "alpha", c = "charlie"
```

Pour un tableau **imbriqué**, on imbrique les crochets :

```js
const points = [1, [2, 3]]

const [x, [y, z]] = points
// x = 1, y = 2, z = 3
```

Avec une **valeur par défaut** si l'élément est `undefined` :

```js
const hand = ["as", "roi"]

const [first = "joker", second = "joker", third = "joker"] = hand
// first = "as", second = "roi", third = "joker" (pas de 3ème carte)
```
