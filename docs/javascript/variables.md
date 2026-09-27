# Les variables

## Déclaration de variables

Les variables pointent vers une valeur. Pour assigner une valeur à une variable on utilise le mot clé **let** ou **const** et la syntaxe _camel case_ pour le nom de la variable. Leur portée est limitée au bloc de code dans lequel elles sont déclarées.

Avec **let**, la variable peut être réassignée :

```js
let cityName = "Paris"
cityName = "Lyon"
```

Avec **const**, la variable ne peut pas être réassignée :

```js
const year = 1990
year = 2000 // Error [!code error]
```

Par convention, les constantes pour les valeurs fixes connues à l'avance s'écrivent en majuscules :

```js
const PI = 3.14159
const MAX_SIZE = 100
```

## Les types primitifs

Les variables de type primitif ne sont pas **mutables** : on ne peut pas modifier la valeur elle-même, seulement réassigner la variable vers une nouvelle valeur.

### Type _number_

Nombre entier ou décimal.

```js
let age = 22
const PI = 3.14159
```

### Type _string_

Pour les chaînes de caractères.

```js
let firstname = "John"
let lastname = "O'Conor"
let fullname = `${firstname} ${lastname}`
```

### Type _boolean_

Ils ne peuvent prendre que deux valeurs : `true` ou `false`

```js
let test = false
```

### Type _undefined_

Variable déclarée mais sans valeur assignée :

```js
let x // undefined
let y = undefined
```

### Type _null_

Absence intentionnelle de valeur :

```js
let z = null
```

### Type _symbol_

Valeur unique et immuable :

```js
const id = Symbol("id")
```

### Type _bigint_

Entier de très grande taille dépassant la limite de Number.

```js
const big = 9007199254740991n
```

## Le type _object_

Les variables de type _object_ sont **mutables** : on peut modifier leur contenu sans réassigner la variable. En JavaScript les objets (collections de paires clé/valeur), les tableaux, les fonctions et les dates sont tous des variables de type objet.

### Les objets

```js
const user = {
    // key : value,
    name: "John",
    age: 30,
}
```

Pour obtenir ou modifier les **propriétés** d'un objet on utilise l'une des notations suivantes. La notation avec les crochets permet d'utiliser une _expression_ à la place du nom de la propriété.

```js
user.name // pour accéder à la propriété 'name'
user.name = "James" // pour modifier la propriété 'name'

user["name"] // pour accéder à la propriété 'name'
user["name"] = "James" // pour modifier la propriété 'name'
```

### Les tableaux

Les tableaux sont des listes ordonnées de valeurs accessibles par index (commence à 0).
En JavaScript, un tableau est un **objet** spécial.

```js
const alphabet = ["a", "b", "c"]

alphabet[0] // "a"
alphabet[2] = "d" // ["a", "b", "d"]
alphabet.length // 3
```

Quelques méthodes utiles sur les tableaux :

```js
const alphabet = ["a", "b", "c"]

alphabet.push("d") // ['a', 'b', 'c', 'd']
alphabet.pop() // ['a', 'b', 'c']
alphabet.unshift("z") // ['z', 'a', 'b', 'c']
alphabet.shift() // ['a', 'b', 'c']
alphabet.indexOf("c") // 2
alphabet.includes("z") // false
```

## Destructuring

Le destructuring permet d'**extraire des valeurs** d'un tableau ou d'un objet et de les assigner directement à des variables.

### Destructuring de tableau

On extrait les valeurs **par position** :

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

### Destructuring d'objet

On extrait les valeurs **par nom de propriété** :

```js
const user = { name: "Jean", age: 30 }

const { name, age } = user
// name = "Jean", age = 30
```

On peut **renommer** la variable à la volée :

```js
const { name: firstName, age: years } = user
// firstName = "Jean", years = 30
```

Et combiner renommage et **valeur par défaut** :

```js
const { name: firstName, city: hometown = "Paris" } = user
// firstName = "Jean", hometown = "Paris" (propriété absente)
```

Sans déclaration, les accolades sont interprétées comme un bloc de code. Les parenthèses sont **obligatoires** :

```js
let name, age

({ name, age } = user) // OK
{ name, age } = user   // Error // [!code error]
```

Pour un objet imbriqué, on imbrique les accolades :

```js
const user = { name: "Jean", address: { city: "Lyon", zip: "69000" } }

const {
    name,
    address: { city, zip },
} = user
// name = "Jean", city = "Lyon", zip = "69000"
```

`address` n'est pas assigné comme variable, il sert uniquement à naviguer dans la structure.

## Copie d'objets

Quand on copie un objet ou un tableau, il faut distinguer deux comportements selon la méthode utilisée.

### Assignation simple

Assigner un objet à une nouvelle variable ne crée pas de copie : les deux variables pointent vers le **même objet** en mémoire.

```js
const user = { name: "Jean", age: 30 }
const userCopy = user

userCopy.name = "Marc"
console.log(user.name) // "Marc" — l'original est modifié !
```

### _Shallow copy_ (copie superficielle)

Une shallow copy crée un **nouvel objet** avec les mêmes propriétés de premier niveau. Mais si l'objet contient des valeurs de type objet (objets imbriqués, tableaux...), celles-ci restent **partagées** entre l'original et la copie.

```js
const user = { name: "Jean", address: { city: "Paris" } }

const userCopy = { ...user }

userCopy.name = "Marc"
console.log(user.name) // "Jean" — propriété primitive, non partagée

userCopy.address.city = "Lyon"
console.log(user.address.city) // "Lyon" — objet imbriqué, toujours partagé !
```

### _Deep copy_ (copie profonde)

Une deep copy crée un **nouvel objet indépendant** à tous les niveaux, y compris les objets imbriqués. Aucune référence n'est partagée avec l'original.

```js
const user = { name: "Jean", address: { city: "Paris" } }

// Avec structuredClone (méthode native moderne)
const userCopy = structuredClone(user)

userCopy.address.city = "Lyon"
console.log(user.address.city) // "Paris" — l'original est intact
```
