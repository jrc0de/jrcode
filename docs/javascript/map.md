# Les Map

## Définition

Une `Map` est une collection de paires _clé / valeur_. Contrairement à un objet classique, les clés peuvent être de n'importe quel type et l'ordre d'insertion est conservé. On peut créer une Map vide, puis la remplir :

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
