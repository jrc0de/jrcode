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

```js
const user = { name: "John" }
user.name = "James" // OK : on modifie le contenu, pas la variable
```

Pour la suite, voir :

- [Les objets](./objets)
- [Les tableaux](./tableaux)
