# Conway's Game of Life

Ce projet est une implémentation du Jeu de la vie de Conway, un automate cellulaire conçu par le mathématicien britannique John Horton Conway.
Ce jeu se déroule sur une grille de cellules carrées qui, basées sur un ensemble de règles simples, vivent, meurent ou se multiplient.

## Fonctionnalités

- **Démarrage et arrêt de la simulation** : Contrôlez le déroulement de la simulation grâce aux boutons de démarrage et d'arrêt.
- **Génération aléatoire** : Initialisez l'état du jeu avec une distribution aléatoire de cellules vivantes.
- **Navigation temporelle** : Avancez ou reculez d'une étape dans la simulation pour observer les changements.
- **Affichage graphique** : Visualisez le jeu sur un canevas HTML, avec une grille et des cellules colorées.

## Comment ça marche ?

Le jeu utilise un canevas HTML pour afficher les cellules. Les cellules peuvent être dans deux états : vivantes ou mortes. À chaque étape de la simulation, l'état de chaque cellule est mis à jour en fonction du nombre de ses voisins vivants :

- Une cellule vivante avec moins de deux voisins vivants meurt (sous-population).
- Une cellule vivante avec deux ou trois voisins vivants reste vivante.
- Une cellule vivante avec plus de trois voisins vivants meurt (surpopulation).
- Une cellule morte avec exactement trois voisins vivants devient vivante (reproduction).

## Démarrage rapide

1. Ouvrez `main.html` dans le navigateur pour lancer l'application.
2. Utilisez les boutons pour contrôler la simulation.

## Prochaines étapes

- Implémentation d'un système de sauvegarde et d'upload de configuration.
- Ajout d'un système de contrôle du frameRate.
- Auto-recherche et implémentation de patterns spécifiques.
