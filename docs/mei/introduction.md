# Introduction

::: tip Format MEI
MEI signifie _Music Encoding Initiative_. C'est un format XML ouvert et
standardisé pour l'encodage structuré de partitions musicales (hauteurs, durées,
articulations, paroles...).
:::

## Structure de base

L'élément racine `<mei>` porte l'attribut `@xmlns`, qui déclare l'espace de noms du document et indique aux outils (comme Verovio) que ce document suit le vocabulaire MEI.

```xml
<mei xmlns="http://www.music-encoding.org/ns/mei"> <!-- [!code highlight] -->
    <meiHead>
        ...
    </meiHead>
    <music>
        ...
    </music>
</mei> <!-- [!code highlight] -->
```

Le bloc d'en-tête `<meiHead>` contient les métadonnées du document (titre, auteur, source...).

```xml
<mei xmlns="http://www.music-encoding.org/ns/mei">
    <meiHead> <!-- [!code highlight] -->
        ...  <!-- [!code highlight] -->
    </meiHead>  <!-- [!code highlight] -->
    <music>
        ...
    </music>
</mei>
```

Le bloc musique `<music>` contient le contenu musical proprement dit.

```xml
<mei xmlns="http://www.music-encoding.org/ns/mei">
    <meiHead>
        ...
    </meiHead>
    <music>  <!-- [!code highlight] -->
        ... <!-- [!code highlight] -->
    </music>  <!-- [!code highlight] -->
</mei>
```

## Bloc d'en-tête

Le bloc d'en-tête est facultatif, il peut être omis et le fichier restera valide. En revanche s'il est incorporé, un certain nombre de sous-éléments doivent apparaître pour que le fichier soit valide.

L'élément de description du fichier `<fileDesc>` est le seul sous-élément direct obligatoire du bloc d'en-tête. Il permet une description bibliographique complète d'un fichier MEI.

```xml
<meiHead>
    <fileDesc> <!-- [!code highlight] -->
        <titleStmt>
            <title></title>
        </titleStmt>
        <pubStmt></pubStmt>
    </fileDesc> <!-- [!code highlight] -->
</meiHead>
```

L'élément de titre de l'œuvre `<titleStmt>` doit aussi être présent ; tout comme son sous-élément `<title>` qui porte le titre de l'œuvre mais peut rester vide.

```xml
<meiHead>
    <fileDesc>
        <titleStmt> <!-- [!code highlight] -->
            <title></title> <!-- [!code highlight] -->
        </titleStmt> <!-- [!code highlight] -->
        <pubStmt></pubStmt>
    </fileDesc>
</meiHead>
```

Enfin l'élément `<pubStmt>` pour les informations de publication (nom et adresse de l'éditeur, date de publication, etc.) est aussi obligatoire mais peut rester vide.

```xml
<meiHead>
    <fileDesc>
        <titleStmt>
            <title></title>
        </titleStmt>
        <pubStmt></pubStmt> <!-- [!code highlight] -->
    </fileDesc>
</meiHead>
```

## Bloc de contenu musical

Le bloc de contenu musical est obligatoire : un fichier MEI ne peut pas être valide sans lui. L'élément `<body>` est unique et obligatoire. Il sert de conteneur racine pour l'ensemble du contenu musical.

```xml
<music>
    <body> <!-- [!code highlight] -->
        <mdiv>
            <score>
                <scoreDef></scoreDef>
                <section></section>
            </score>
        </mdiv>
    </body> <!-- [!code highlight] -->
</music>
```

L'élément `<mdiv>` représente une division de la partition (mouvement, acte, scène...). Il est obligatoire et peut être répété ou imbriqué pour représenter les subdivisions de l'œuvre.

```xml
<music>
    <body>
        <mdiv> <!-- [!code highlight] -->
            <score>
                <scoreDef></scoreDef>
                <section></section>
            </score>
        </mdiv> <!-- [!code highlight] -->
    </body>
</music>
```

L'élément `<score>` contient la partition complète. Il est obligatoire et se compose de deux élément eux aussi bligatoires : `<scoreDef>` pour la définition globale des portées et des clés ainsi que `<section>` pour les différentes mesures et leurs notes.

```xml
<music>
    <body>
        <mdiv>
            <score> <!-- [!code highlight] -->
                <scoreDef></scoreDef> <!-- [!code highlight] -->
                <section></section> <!-- [!code highlight] -->
            </score> <!-- [!code highlight] -->
        </mdiv>
    </body>
</music>
```
