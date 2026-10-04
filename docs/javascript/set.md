# Les Set

## Définition

Un `Set` est une collection de valeurs uniques : chaque valeur ne peut apparaître qu'une seule fois. Contrairement à un tableau, il n'y a pas d'index, mais l'ordre d'insertion est conservé.

```js
const letters = new Set(["a", "b", "c", "a"])

letters // Set { "a", "b", "c" } (le doublon est ignoré)
letters.size // 3
```

On peut aussi créer un Set vide, puis le remplir :

```js
const letters = new Set()
letters.add("a")
```

## Méthodes utiles sur les Set

```js
const letters = new Set(["a", "b", "c"])

letters.add("d") // Set { 'a', 'b', 'c', 'd' }
letters.add("a") // Set { 'a', 'b', 'c', 'd' } (déjà présent, rien ne change)
letters.delete("d") // true, Set { 'a', 'b', 'c' }
letters.has("c") // true
letters.has("z") // false
letters.clear() // Set {} (vide le Set)
```

`add` retourne le Set lui-même, on peut donc **chaîner** les appels :

```js
const letters = new Set()
letters.add("a").add("b").add("c")
```

## Parcourir un Set

Un Set est itérable : on peut le parcourir avec `for...of` ou `forEach`.

```js
const letters = new Set(["a", "b", "c"])

for (const letter of letters) {
    console.log(letter) // "a", "b", "c"
}

letters.forEach((letter) => console.log(letter))
```

## Convertir entre Set et tableau

On utilise le _spread oparator_ (`...`) ou `Array.from` pour transformer un Set en tableau :

```js
const letters = new Set(["a", "b", "c"])

const array = [...letters] // ["a", "b", "c"]
const array2 = Array.from(letters) // ["a", "b", "c"]
```

Et inversement, on passe un tableau au constructeur :

```js
const set = new Set(["a", "b", "b"]) // Set { "a", "b" }
```

## Cas d'usage

L'un des cas d'usage les plus courants est de supprimer les doublons :

```js
const numbers = [1, 2, 2, 3, 3, 3]
const unique = [...new Set(numbers)]
// [1, 2, 3]
```
