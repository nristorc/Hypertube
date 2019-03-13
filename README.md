# HYPERTUBE - ECOLE 42

**Projet réalisé dans le cadre de notre formation à l'école 42 - dernier projet de la branche Web avant stage**\
Documentation API: [Postman](https://documenter.getpostman.com/view/6363897/S11RKFVL)

**Credit to: [acoulomb](https://github.com/acoulomb) - [akarasso](https://github.com/akarasso) - [dlaurent](https://github.com/dlaurent42) - [nristorc](https://github.com/nristorc)**

# Technologies utilisées

* **API RESTful**
* Serveur: **NodeJS** - Framework **Express**
* Client: **ReactJS - Redux**
* Base de données: **MongoDB**

## Table des matières
- [Technologies utilisées](#technologies-utilisées)
- [Introduction](#introduction)
- [Consignes générales](#consignes-générales)
- [Partie utilisateur](#partie-utilisateur)
- [Partie bibliothèque](#partie-bibliothèque)
	- [Recherche](#recherche)
	- [Miniatures](#miniatures)
- [Partie vidéo](#partie-vidéo)
- [Partie bonus](#partie-bonus)
- [Preview](#preview)

# Introduction

Ce projet propose de créer une application web permettant à un utilisateur de rechercher et visionner des vidéos.
Le lecteur sera directement intégré au site, et les vidéos seront téléchargées au travers du protocole BitTorrent.
Le moteur de recherche interrogera plusieurs sources externes de votre choix, comme par exemple http://www.legittorrents.info.
Une fois un élément sélectionné, il sera téléchargé sur le serveur et diffusé sur le player web en même temps. Autrement dit, le lecteur ne se contentera pas d’afficher la vidéo une fois le téléchargement complété, mais sera capable de streamer directement le flux.

# Consignes générales

Tous les framework, micro-framework, librairies etc... sont autorisés dans la limite où ils ne servent pas à créer un flux vidéo à partir d’un torrent.
:warning:  Par exemple, des librairies comme webtorrent, pulsar ou peerflix sont interdites.
:iphone:  Votre site devra être présentable sur mobile, et garder une mise en page acceptable
sur de petites résolutions.

# Partie utilisateur

- L’application doit permettre à un utilisateur de s’inscrire avec:
	- **adresse email**
	- **login**
	- **photo de profil**
	- **nom**
    - **prénom** 
    - **mot de passe**

- :warning: L’utilisateur doit pouvoir s’inscrire et se connecter via **Omniauth**. 
	- **Deux stratégie obligatoire**, 42 et une autre au choix.
	
- L’utilisateur doit être capable de se connecter avec:
    - **login**
    - **mot de passe** 
- Il doit également pouvoir recevoir un **mail de réinitialisation**
    de son mot de passe en cas d’oubli.
- L’utilisateur doit pouvoir se **déconnecter en un seul clic** depuis n’importe quelle
    page du site.
- :warning: L’utilisateur doit pouvoir **sélectionner une langue préférée par défaut l’anglais.**
- L’utilisateur doit pouvoir **Modifier** son **adresse email**, sa **photo de profil** et ses **informations.**
-  **Consulter** le **profil d’un autre utilisateur**. C’est à dire afficher sa photo de profil,
    ses informations. **L’ email, en revanche, doit rester privé.*

# Partie bibliothèque

:warning: **Cette partie ne doit être accessible qu’aux utilisateurs connectés.**

:information_source: Cette partie doit présenter au minimum :

- Un champ de recherche.
- Une liste de miniatures.

### **Recherche**

Le moteur de recherche devra interroger au moins deux sources externes de votre
choix, et retourner l’ensemble des résultats sous la forme de miniatures.
Vous devez limiter les résultats aux vidéos uniquement.

### **Miniatures**

- **Si une recherche a été faite,** les résultats doivent s’afficher sous la **forme d’une liste de miniatures**, **triées par nom**.

- **Si aucune recherche n’a été faite**, vous devrez afficher les médias **les plus populaires** de
vos sources externes, triés selon **le critère de votre choix** (téléchargements, peers, seeders,
etc...).

- :information_source: Une **miniature** doit être **composée** de: 
 	- **nom de la vidéo**
 	- **année de production**
 	- **note**
  	- **image de couverture**

:warning: Vous devrez **différencier** les vidéos vues des vidéos non-vues, de la manière de votre choix.

:warning: La liste devra être paginée, à chaque fin de page, la suivante doit être automatiquement chargée de manière asynchrone. Autrement dit, il ne doit pas y avoir de lien pour chaque page.

:information_source: La liste devra être triable et filtrable selon des critères tels que le nom, le genre, un
intervalle de note, un intervalle d’année de production, etc...

# Partie vidéo

:warning: **Cette partie ne doit être accessible qu’aux utilisateurs connectés.**

Cette section devra **présenter le détail d’une vidéo**, c’est à dire:

 - **afficher le player de la vidéo**.
 - :information_source:  **si disponible** 
    - le résumé
    - le casting (au moins producteur, réalisateur, acteurs principaux, etc...)
    - l’année de production
    - la durée
    - la note
    - une image de couverture et tout ce qui vous semblerait pertinent.

:warning:  Vous devez également donner aux utilisateurs la possibilité de **laisser un commentaire**
sur la vidéo, et **afficher la liste des commentaires précédents.**

:information_source: 
Lancer la vidéo sur le navigateur doit - *si le fichier n’a pas déjà été téléchargé précédemment* - lancer le téléchargement du torrent associé sur le serveur, et streamer le flux vidéo depuis ce dernier dès que suffisament de données sont téléchargées pour assurer la **lecture intégrale de la vidéo sans interruption.** Bien évidemment, tout le traitement doit être fait en arrière plan de manière non-bloquante.

:information_source: 
Une fois un film téléchargé intégralement, **il doit être sauvegardé sur le serveur,** de manière à ne pas re-télécharger un film plusieurs fois.
:warning:  Si un film n’est pas visionné pendant un mois, il devra être supprimé.

:warning: 
Si des sous-titres anglais sont disponibles pour cette vidéo, ils devront être téléchargés et sélectionnables sur le player vidéo. De même, si la langue de la vidéo ne correspond pas à la langue préférée de l’utilisateur, et que des sous-titres sont disponibles pour cette langue, ils devront également être téléchargés et sélectionnables.

Si la vidéo n’est pas nativement lisible pour le navigateur(c-ad que ce n’est ni dump4, ni du webm). vous devrez la convertir à la volée dans un format acceptable. **Le support du format mkv est un minimum.**

# Partie bonus
- Ajouter des stratégies Omniauth supplémentaires. **done : Github, Gitlab, Facebook**
- Gérer différentes résolutions de vidéo.
- Développer une API RESTful. **done**
- Streamer la vidéo via l’API MediaStream.

Bonus supplémentaires effectués
- Creation d'un server d'authentification indépendant **done: methode `password` et `authorization_code`**
- Documentation API **done**
- Marquer les films à voir plus tard par l'utilisateur (watchlist)

# Preview
[Vidéo de présentation Hypertube](https://drive.google.com/open?id=1YGjg0wUkvyfmE9Sa5fikl8_MT-4mGT23)

Login Page
![Screen 1](https://drive.google.com/uc?id=1f4ExtnbuGv3IB9WHCpekpJsx6RTwetoR)

Films Populaires (Home)
![Films Populaires (Home)](https://drive.google.com/uc?id=1wEhkRGPZe4U9Aw-CRfvasswq6JuLH0K2)

Recherche
![Recherche](https://drive.google.com/uc?id=1LJ5s6NB-tnfY0SydyOZobS6BsE-PT-UK)

Page Film
![Page Film](https://drive.google.com/uc?id=1kdDfD6x4JvoaDH5s8aciR54U2VdfEt15)

Page Utilisateur
![Page utilisateur](https://drive.google.com/uc?id=1-S3VpqM9na74Isj4i49YMcMyBSZNREWS)

Watchlist
![Watchlist](https://drive.google.com/uc?id=1N-CutkGXD7ytXsdASbaL_bYCpi4HsVoX)
