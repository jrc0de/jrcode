# Types de données PostgreSQL

## Types numériques

### Types entiers

#### `smallint` (alias : `int2`)

- **Taille** : 2 octets
- **Plage** : -32 768 à 32 767
- **Utilisation** : à privilégier pour les valeurs dont le domaine est naturellement borné et connu : note, mois, jour de la semaine, code pays ISO numérique... et pour des tables très volumineuses où chaque octet compte

#### `integer` (alias : `int`, `int4`)

- **Taille** : 4 octets
- **Plage** : -2 147 483 648 à 2 147 483 647
- **Utilisation** : type entier à utiliser par défaut dans la plupart des cas (clés primaires, compteurs, identifiants métier...)

#### `bigint` (alias : `int8`)

- **Taille** : 8 octets
- **Plage** : ±9.2 × 10¹⁸
- **Utilisation** : clé primaire sur des tables à fort volume (logs, événements, messages), timestamps en millisecondes ou microsecondes stockés comme entier

### Nombres à précision arbitraire

#### `numeric(p, s)` (alias : `decimal(p, s)`)

- **Taille** : variable
- `p` = nombre total de chiffres significatifs, `s` = chiffres après la virgule
- **Utilisation** : seul type acceptable pour les montants monétaires, taux et tout calcul où la précision doit être garantie

```sql
prix : numeric(10, 2) -- jusqu'à 99 999 999.99
taux_tva : numeric(5, 4) -- 0.2000 pour 20%
```

### Types à virgule flottante

#### `real` (alias : `float4`)

- **Taille** : 4 octets — précision : ~ 6 chiffres significatifs
- **Utilisation** : calculs scientifiques où une légère imprécision est acceptable

#### `double precision` (alias : `float8`)

- **Taille** : 8 octets — précision : ~15 chiffres significatifs
- **Utilisation** : comme `real` mais avec une précision plus élevée — à privilégier pour les coordonnées GPS et les mesures physiques

## Types caractère

### `text`

- **Taille** : illimitée
- **Utilisation** : type par défaut pour toute chaîne sans contrainte de longueur (noms, descriptions, contenus...)

### `varchar(n)`

- **Taille** : jusqu'à `n` caractères
- **Utilisation** : quand on veut imposer une longueur maximale en base (ex: code postal, slug, code ISO...) — en dehors de ça, préférer `text`

> En PostgreSQL, `text` et `varchar` ont les mêmes performances — contrairement à d'autres SGBD, il n'y a aucun gain à utiliser `varchar` pour "optimiser".

## Types date/heure

### `date`

- **Taille** : 4 octets
- **Plage** : 4713 av. J.-C. à 5874897 ap. J.-C.
- **Utilisation** : date seule sans heure (date de naissance, date d'échéance, date de publication...)

### `timestamp` (alias : `timestamp without time zone`)

- **Taille** : 8 octets
- **Utilisation** : date + heure sans fuseau horaire — à utiliser uniquement si toutes les données sont garanties dans le même fuseau

### `timestamptz` (alias : `timestamp with time zone`)

- **Taille** : 8 octets
- **Utilisation** : date + heure avec fuseau horaire — **type à privilégier par défaut** pour tout horodatage (`created_at`, `updated_at`...) — PostgreSQL stocke en UTC et convertit à l'affichage selon le fuseau de la session

## Type booléen

### `boolean`

- **Taille** : 1 octet
- **Valeurs** : `true` / `false` / `null`
- **Utilisation** : flags et états binaires

## Type UUID

### `uuid`

- **Taille** : 16 octets
- **Utilisation** : identifiant universel unique — en clé primaire quand on veut éviter des IDs séquentiels prévisibles, ou pour tout identifiant unique non séquentiel (token, clé d'API, identifiant de session...)

## Types JSON

### `json`

- **Taille** : variable (stockage texte brut)
- **Utilisation** : à éviter — PostgreSQL stocke le texte tel quel, sans le parser, ce qui empêche toute indexation et rend les requêtes bien plus lentes qu'avec `jsonb`

### `jsonb`

- **Taille** : variable (stockage binaire, légèrement plus lourd que `json`)
- **Utilisation** : stocker des données semi-structurées ou dont le schéma est variable — indexable et interrogeable efficacement avec les opérateurs PostgreSQL
