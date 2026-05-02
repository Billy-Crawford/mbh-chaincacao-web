ChainCacao Web

Plateforme de traçabilité agricole (Cacao / Café)

1. Description

ChainCacao est une application web permettant de suivre et de vérifier la traçabilité des produits agricoles, en particulier le cacao et le café, depuis leur production jusqu’à leur exportation.

Le système repose sur une architecture multi-acteurs et simule une logique inspirée de la blockchain afin de garantir :

la transparence
l’intégrité des données
la conformité réglementaire (EUDR)
2. Fonctionnalités principales
Gestion des utilisateurs
Inscription avec rôles :
Coopérative
Transformateur
Exportateur
Authentification sécurisée
Gestion des lots
Création de lots par les agriculteurs (via backend)
Consultation des lots par rôle
Affichage des détails (poids, culture, GPS)
Flux de traçabilité
Réception des lots (coopérative)
Vérification du poids
Transfert vers transformateur
Traitement et mise à jour
Transfert vers exportateur
Validation finale
Historique (logique blockchain)
Enregistrement de chaque étape
Horodatage des actions
Suivi complet du cycle de vie du lot
Vérification publique
Recherche par identifiant de lot
Affichage :
historique complet
acteurs impliqués
statut de conformité
Interface accessible sans authentification
3. Technologies utilisées
Frontend
Next.js (App Router)
TypeScript
Tailwind CSS
Backend
Django REST Framework
PostgreSQL
Communication
API REST (JSON)
Authentification par token
4. Structure du projet
src/
 ├── app/
 │   ├── cooperative/
 │   ├── transformateur/
 │   ├── exportateur/
 │   ├── login/
 │   ├── register/
 │   └── verify/
 ├── hooks/
 ├── services/
 ├── lib/
 └── components/
5. Installation
Prérequis
Node.js >= 18
npm ou yarn
Étapes
# Cloner le projet
git clone https://github.com/ton-repo/chaincacao-web.git

# Aller dans le dossier
cd chaincacao-web

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env

Dans .env :

NEXT_PUBLIC_API_URL=http://localhost:8000
Lancer le projet
npm run dev

Application disponible sur :

http://localhost:3000
6. Utilisation
Connexion par rôle
Coopérative → /cooperative/dashboard
Transformateur → /transformateur/dashboard
Exportateur → /exportateur/dashboard
Vérification publique
/verify

Permet de consulter l’historique d’un lot via son identifiant.

7. Fonctionnement global
Création d’un lot
Réception par la coopérative
Transfert vers transformateur
Traitement du lot
Envoi à l’exportateur
Certification
Vérification publique
8. Améliorations futures
Carte interactive (Google Maps)
Notifications en temps réel
9. Auteur

Projet réalisé dans le cadre d’un hackathon / projet académique.