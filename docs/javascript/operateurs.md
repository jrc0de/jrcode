# Les opérateurs

## Opérateurs mathématiques

- `+` pour additionner des nombres ou concaténer des chaînes de caractères
- `-` pour soustraire une valeur
- `/` pour diviser une valeur
- `*` pour multiplier une valeur
- `**` pour élever un nombre à une puissance
- `%` pour obtenir le reste d'une division (modulo)

## Opérateurs d'assignement

- `=` pour assigner une valeur à une variable
- `+=`, `-=`, `*=`, `/=` pour modifier et réassigner une variable
- `++` pour incrémenter de 1 (raccourci de `+= 1`)
- `--` pour décrémenter de 1 (raccourci de `-= 1`)

## Opérateurs de comparaison

- `==` pour vérifier l'égalité de valeur
- `===` pour vérifier l'égalité de valeur **et** de type (recommandé)
- `!=` pour vérifier l'inégalité de valeur
- `!==` pour vérifier l'inégalité de valeur **et** de type (recommandé)
- `<`, `>` pour inférieur / supérieur
- `<=`, `>=` pour inférieur ou égal / supérieur ou égal

## Opérateurs logiques

- `!` pour inverser un Boolean
- `&&` pour vérifier que deux conditions sont vraies (ET)
- `||` pour vérifier qu'au moins une condition est vraie (OU)

## Le _short-circuiting_

Les opérateurs `&&` et `||` n'évaluent pas forcément les deux membres de l'expression : dès que le résultat final est connu, JavaScript s'arrête et renvoie la valeur correspondante (et non forcément `true` ou `false`).

```js
// || renvoie la première valeur "truthy" rencontrée,
// sinon la dernière valeur
console.log(false || "salut") // 'salut'
console.log("hello" || "salut") // 'hello' (jamais évalué "salut")
console.log(0 || "") // '' (les deux sont falsy)

// && renvoie la première valeur "falsy" rencontrée,
// sinon la dernière valeur
console.log(true && "salut") // 'salut'
console.log(false && "salut") // false (jamais évalué "salut")
console.log(0 && "salut") // 0
```

Ce comportement est très utilisé en pratique :

```js
// Définir une valeur par défaut
const pseudo = user.pseudo || "Anonyme"

// N'exécuter une fonction que si une condition est vraie
isConnected && afficherMenu()
```

## Opérateur de coalescence des nuls

L'opérateur de coalescence des nuls `??` ressemble à `||`, mais il ne renvoie la valeur de droite que si celle de gauche est `null` ou `undefined` et non pas pour toutes les valeurs _falsy_ comme `0`, `''` ou `false`.

```js
console.log(0 || "default") // 'default' (0 est falsy)
console.log(0 ?? "default") // 0 (0 n'est ni null ni undefined)
```

## Opérateurs d'assignation logique

Ces opérateurs combinent un opérateur logique avec une assignation : ils n'assignent une nouvelle valeur à la variable que si une certaine condition est remplie.

- L'operateur d'assignement _OU_ : `||=` assigne la valeur de droite uniquement si la variable est **falsy**.
- L'operateur d'assignement _ET_ : `&&=` assigne la valeur de droite uniquement si la variable est **truthy**.
- L'operateur d'assignement _coalescence des nuls_ : `??=` assigne la valeur de droite uniquement si la variable est `null` ou `undefined`.

```js
// ||= : la variable est truthy → pas d'assignation
let score = 42
score ||= 100 // reste 42
```

```js
// &&= : la variable est truthy → assignation
let pseudo = "Bob"
pseudo &&= "Modéré" // 'Modéré' (car "Bob" est truthy)
```

```js
// ??= : la variable est null/undefined → assignation
let message
message ??= "Anonyme" // 'Anonyme'
```

## Chaînage optionnel

L'opérateur de chaînage optionnel `?.` permet d'accéder à une propriété, une méthode, ou un élément d'un objet potentiellement `null` ou `undefined`, sans provoquer d'erreur. Avec `?.`, si la valeur de gauche est `null` ou `undefined`, l'expression s'arrête immédiatement et renvoie `undefined`. Il fonctionne aussi avec des méthodes et des tableaux.

```js
const user = null

console.log(user?.name) // undefined (pas d'erreur)

user?.getFullName() // n'appelle la méthode que si user existe

arr?.[0] // accède à l'index 0 seulement si arr existe
```

Il se combine très souvent avec `??` pour fournir une valeur par défaut :

```js
const pseudo = user?.profile?.pseudo ?? "Anonyme"
```

## Opérateur _spread_

L'opérateur de décomposition (_spread operator_) permet de **copier**, **fusionner** ou **étendre** des tableaux et des objets en JavaScript. Il s’écrit avec trois points : `...`.

```js
const a = [1, 2, 3]
const copie = [0, ...a, 4] // [0, 1, 2, 3, 4]

const b = { x: 1, y: 2 }
const c = { y: 99, z: 3 }
const fusion = { ...b, ...c } // { x: 1, y: 99, z: 3 }
```

## Syntaxe _rest_

Cette syntaxe (_rest pattern_) utilise la même syntaxe que le _spread_ (`...`), mais fait l'inverse. Au lieu d'étendre un tableau ou un objet, il regroupe plusieurs valeurs dans un seul tableau ou objet.

```js
const [first, ...rest] = ["bread", "milk", "eggs", "butter"]
// first = 'bread'
// rest = ['milk', 'eggs', 'butter']

function showItems(...items) {
  console.log(items) // ['bread', 'milk', 'eggs']
}

showItems("bread", "milk", "eggs")
```

:::tip Astuce
Le _spread_ **éclate** une collection (à droite d'une assignation ou dans un appel de fonction), le _rest_ **rassemble** des valeurs (à gauche d'une assignation ou dans une déclaration de paramètres).
:::
