# Les objets

Un objet est une collection de **paires clé/valeur**. Chaque paire forme une **propriété** de l'objet.

```js
const user = {
    // key : value,
    name: "John",
    age: 30,
}
```

## Accéder aux propriétés

Pour obtenir ou modifier les propriétés d'un objet on utilise l'une des notations suivantes. La notation avec les crochets permet d'utiliser une _expression_ à la place du nom de la propriété.

```js
user.name // pour accéder à la propriété 'name'
user.name = "James" // pour modifier la propriété 'name'

user["name"] // pour accéder à la propriété 'name'
user["name"] = "James" // pour modifier la propriété 'name'
```

Accéder à une propriété d'un objet `undefined` ou `null` provoque une erreur :

```js
const user = { name: "Jean" }

user.address.city // TypeError: Cannot read properties of undefined [!code error]
```

## Ajouter et supprimer des propriétés

Même avec `const`, on peut modifier le contenu d'un objet : seule la réassignation de la variable est interdite.

```js
const user = { name: "John" }

user.age = 30 // ajoute la propriété 'age'
delete user.age // supprime la propriété 'age'
```

## Clés calculées (_computed property names_)

Dans un littéral d'objet, des crochets autour d'une **expression** permettent de calculer le nom de la propriété au moment de la création de l'objet. N'importe quelle expression est acceptée : concaténation, template string, appel de fonction...

```js
const key = "email"

const user = {
    name: "Jean",
    [key]: "jean@mail.com",
}
// { name: "Jean", email: "jean@mail.com" }
```

Pour **lire** une propriété dont le nom est dans une variable, on utilise la notation avec crochets :

```js
const field = "name"
user[field] // "Jean"
user.field // undefined : cherche une propriété littéralement nommée "field"
```

## Copie d'objets

Quand on copie un objet, il faut distinguer deux comportements selon la méthode utilisée.

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

## Ajouter et fusionner des objets

### Ajouter un objet imbriqué

Un objet peut contenir un autre objet comme valeur de propriété. On peut l'ajouter par assignation directe, ce qui **modifie** l'objet d'origine :

```js
const user = { name: "Jean", age: 30 }
const address = { city: "Lyon", zip: "69000" }

user.address = address
// user = { name: "Jean", age: 30, address: { city: "Lyon", zip: "69000" } }
```

### Sans modifier l'original

Avec le spread, on crée un nouvel objet en y ajoutant une propriété, sans toucher à `user` :

```js
const user = { name: "Jean", age: 30 }
const address = { city: "Lyon", zip: "69000" }

const userWithAddress = { ...user, address }
// { name: "Jean", age: 30, address: { city: "Lyon", zip: "69000" } }
```

`{ address }` est la **notation raccourcie** de `{ address: address }` : quand la variable porte le même nom que la propriété, on peut ne l'écrire qu'une fois.

### Fusionner deux objets

Si une propriété existe dans les deux objets, **la dernière l'emporte** :

```js
const defaults = { theme: "light", lang: "fr" }
const options = { theme: "dark" }

const settings = { ...defaults, ...options }
// { theme: "dark", lang: "fr" }
```

### Modifier un objet imbriqué sans muter l'original

Le spread est une _shallow copy_ : pour modifier une propriété d'un objet imbriqué, il faut aussi copier ce niveau, sinon on partagerait la référence :

```js
const user = { name: "Jean", address: { city: "Paris", zip: "75000" } }

const moved = {
    ...user,
    address: { ...user.address, city: "Lyon" },
}
// moved.address = { city: "Lyon", zip: "75000" }
// user.address.city est toujours "Paris"
```

## Destructuring d'objet

Le destructuring permet d'**extraire des valeurs** d'un objet et de les assigner directement à des variables. On extrait les valeurs **par nom de propriété** :

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

Avec une clé calculée, le renommage est obligatoire :

```js
const field = "name"
const { [field]: value } = user
// value = "Jean"
```

Pour récupérer les propriétés restantes dans un nouvel objet, on utilise `...` :

```js
const { name, ...others } = { name: "Jean", age: 30, city: "Lyon" }
// name = "Jean", others = { age: 30, city: "Lyon" }
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
