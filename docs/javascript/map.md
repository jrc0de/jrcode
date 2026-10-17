# Les Map

## Définition

Une `Map` est une collection de paires clé/valeur, comme un objet. Chaque paire forme une entrée (_entry_) de la Map. Contrairement à un objet classique, les clés peuvent être de n'importe quel type et l'ordre d'insertion est conservé. Le constructeur reçoit un tableau de paires : chaque paire est un tableau [clé, valeur].

```js
const user = new Map([
    // [key, value],
    ["name", "John"],
    ["age", 30],
])
// Map(2) { "name" => "John", "age" => 30 }
```

On peut aussi créer une Map vide, puis la remplir :

```js
const user = new Map()
user.set("name", "Alice")
user.size // 1
```

## Méthodes utiles

```js
const user = new Map([["name", "Alice"]])

user.set("age", 30) // Map { "name" => "Alice", "age" => 30 }
user.set("age", 31) // Map { "name" => "Alice", "age" => 31 } (la valeur est écrasée)
user.get("name") // "Alice"
user.get("city") // undefined (clé absente)
user.has("age") // true
user.has("city") // false
user.delete("age") // true, Map { "name" => "Alice" }
user.clear() // Map {} (vide la Map)
```

`set` retourne la Map elle-même, on peut donc chaîner les appels :

```js
const user = new Map()
user.set("name", "Alice").set("age", 30).set("city", "Paris")
```
