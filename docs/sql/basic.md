# Basiques du langage

## Créer une nouvelle table

On peut créer une nouvelle table avec l'instruction `CREATE TABLE`, en spécifiant le nom de la table, suivi du nom de toutes les colonnes et de leur type :

```sql
CREATE TABLE weather (
    city varchar(80),
    temp_lo integer,
    temp_hi integer,
    prcp real,
    observed_on date
);
```

::: tip
Toutes les instructions SQL doivent se terminer par `;` pour être exécutées.
:::

## Remplir une table

L'instruction `INSERT` est utilisée pour remplir une table avec des lignes. Les constantes qui ne sont pas des valeurs numériques simples doivent être entourées par des guillemets simples.

```sql
INSERT INTO weather
VALUES ('Paris', 21, 32, 0.25, '2020-07-22');
```

Une syntaxe alternative permet de lister les colonnes dans un ordre différent si on le souhaite, et d'en omettre certaines :

```sql
INSERT INTO weather (observed_on, city, temp_hi, temp_lo)
VALUES ('2021-04-26', 'Lyon', 14, 8);
```

On peut aussi utiliser `COPY` pour charger de grandes quantités de données depuis un fichier texte, avec les valeurs séparées par des tabulations :

```sql
COPY weather FROM '/home/user/weather.txt';
```

```txt
Paris   21  32  0.25    2020-07-22
Lyon    8   14  \N      2021-04-26
```

## Interroger une table

Pour retrouver les données d'une table, on l'interroge avec l'instruction `SELECT`. L'instruction est divisée en liste de sélection (la partie qui liste les colonnes à retourner), une liste de tables (la partie qui liste les tables à partir desquelles les données seront retrouvées) et une qualification optionnelle (la partie qui spécifie les restrictions). Par exemple, pour retrouver toutes les lignes de la table _weather_ :

```sql
SELECT city, temp_lo, temp_hi, prcp, observed_on FROM weather;
-- ou encore :
SELECT * FROM weather;
```

::: tip
`*` est un raccourci pour _toutes les colonnes_ mais n'est pas recommandé en production car l'ajout d'une colonne dans la table peut modifier les résultats et nuire aux performances.
:::

On peut aussi écrire des expressions dans la liste de sélection :

```sql
SELECT city, (temp_hi+temp_lo)/2 AS temp_avg, observed_on FROM weather;
```

::: tip
La clause `AS` est utilisée pour renommer la sortie d'une colonne.
:::

Une requête peut être qualifiée en ajoutant une clause `WHERE` qui spécifie les lignes souhaitées. La clause `WHERE` contient une expression booléenne et seules les lignes pour lesquelles l'expression booléenne est vraie sont renvoyées. Les opérateurs booléens habituels `AND`, `OR` et `NOT` sont autorisés.

```sql
SELECT * FROM weather
WHERE city = 'Marseille' AND prcp > 0.0;
```

L'instruction `ORDER BY` permet de recevoir les résultats d'une requête dans un ordre trié :

```sql
SELECT * FROM weather
ORDER BY city; -- tri alphabétique


SELECT * FROM weather
ORDER BY city, temp_lo; -- tri alphabétique puis numérique
```

On peut également utiliser `DISTINCT` pour supprimer les lignes dupliquées du résultat d'une requête :

```sql
SELECT DISTINCT city
FROM weather;
```

## Mises à jour

On peut mettre à jour une ligne existante en utilisant l'instruction `UPDATE` :

```sql
UPDATE weather
SET temp_hi = temp_hi - 2,  temp_lo = temp_lo - 2
WHERE observed_on > '2000-01-01';
```

## Suppressions

Les lignes peuvent être supprimées de la table avec l'instruction `DELETE` :

```sql
DELETE FROM weather WHERE city = 'Brest';
```

::: tip
Faire très attention aux instructions de la forme `DELETE FROM table_name;`. Sans une qualification, `DELETE` supprimera toutes les lignes de la table donnée, la laissant vide. Le système le fera sans demander de confirmation !
:::

Pour supprimer une table on utilise l'instruction `DROP TABLE` :

```sql
DROP TABLE table_name;
```

## Commentaires

Pour rédiger un commentaire sur une seule ligne on emploie `--` :

```sql
SELECT * FROM weather; -- commentaire sur une ligne
```

Pour des commentaires sur plusieurs lignes, on utilise `/*` et `*/` :

```sql
/* ceci est un commentaire
   sur plusieurs lignes */
SELECT * FROM weather;
```
