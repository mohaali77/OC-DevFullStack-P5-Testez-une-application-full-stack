# Projet Yoga - Angular | Spring Boot & MySQL

## Description
Ce projet consiste en une application web de gestion de session de Yoga, développée en utilisant Java et Spring Boot pour le backend, ainsi qu'Angular pour le frontend. Ce guide vous accompagnera étape par étape pour configurer et exécuter l'application.

## Prérequis
- **Java 11** 
- **Node.js 16** 
- **Npm** 
- **MySQL** 
- **Angular CLI 14**
- **Git** 

## Installation du dépôt

**1. Cloner le dépôt :**

 ```bash
   git clone https://github.com/OpenClassrooms-Student-Center/Testez-une-application-full-stack
```

## Installation de la base de donnée

**1. Créer une nouvelle base de données dans MySQL :**

```bash
  CREATE DATABASE test;
  ```
**2. Télécharger le script SQL [ici](https://github.com/OpenClassrooms-Student-Center/Testez-une-application-full-stack/blob/master/ressources/sql/script.sql) et exécuter le :** 

```bash
  USE test;
   ```
```bash
  SOURCE C:/your/path/to/script.sql;
   ```
**3. Par défaut, un admin sera générer avec la base de donnée : ** 

Email : 

```bash
   yoga@studio.com
   ```
Mot de passe :
   
 ```bash
	test!1234
   ```
   
## Installation du Frontend


**1. Accéder au répertoire du frontend :**

 ```bash
  cd front
   ```
**2. Installer les dépendances**

```bash
  npm install
   ```
**3. Lancer l'application Angular :**

```bash
  ng serve
   ```

**4. L'application sera accessible à l'adresse suivante :**

```bash
  http://localhost:4200
   ```

## Installation du Backend


**1. Accéder au répertoire du back-end :**

 ```bash
  cd back
   ```
   
**2. Lancer l'application Spring Boot :**

```bash
  mvn spring-boot:run
```

## Test Front-end :

### Jest :

**1. Lancer les tests unitaires et d'intégrations Jest : :**

```bash
npm run test
```

**2. Voir le rapport de couverture Jest :**

```bash
npx jest --coverage
```

### Cypress :

**1. Lancer les tests end-to-end Cypress :**

```bash
npm run e2e
```

**2. Voir le rapport de couverture (Lancer les test e2e avant) :**

```bash
npm run e2e:coverage
```

## Test Back-end :

**1. Lancer les test Cypress :**

```bash
mvn clean
```

```bash
mvn install
```

```bash
mvn test
```

**2. Voir le rapport de couverture généré ici :**

```bash
back/target/site/index.html
```




   