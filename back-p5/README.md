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
   git clone https://github.com/mohaali77/OC-DevFullStack-P5-Testez-une-application-full-stack
```

## Installation de la base de donnée

**1. Créer une nouvelle base de données dans MySQL :**

```bash
  CREATE DATABASE test;
  ```
**2. Télécharger le script SQL [ici](https://github.com/mohaali77/OC-DevFullStack-P5-Testez-une-application-full-stack/blob/clean-main/ressources/sql/script.sql) et exécuter le :** 

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
  npm run start
   ```
   
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

## IMPORTANT :

Ce projet comporte un total de 60 tests répartis comme suit :

Front-end : 13 tests (hors tests create), dont 7 tests d’intégration et 6 tests unitaires, soit environ 54 % d’intégration et 46 % d’unitaires.

Back-end : 47 tests, dont 32 tests d’intégration et 15 tests unitaires, soit environ 68 % d’intégration et 32 % d’unitaires.


### Jest :

**1. Lancer les tests unitaires et d'intégrations Jest :**

```bash
npm run test
```

```bash
npx jest
```

**2. Voir le rapport de couverture Jest :**

```bash
npm run test -- --coverage
```

```bash
npx jest --coverage
```

Le rapport de couverture sera affiché dans le terminal, mais également dans ce fichier : 

```bash
front/coverage/jest/lcov-report/index.html
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

**1. Configurer le fichier application.properties :**

```bash
  spring.datasource.username=VOTRE_USERNAME_MYSQL
  spring.datasource.password=VOTRE_PASSWORD_MYSQL
```

**2. Lancer les test back-end :**

```bash
mvn clean
```

```bash
mvn install
```

```bash
mvn test
```

**3. Voir le rapport de couverture généré ici :**

```bash
back/target/site/index.html
```




   