# MLD – Gestion des déchets (3NF)

Zone(#id_zone, nom_zone, code_postal, description)

Type_Dechets(#id_Type_Dechets, libelle, couleur)

Conteneur(#id_conteneur, reference, adresse, etat, latitude, longitude, capacite_totale, date_installation, ##id_zone, ##id_type_dechets)

Capteur(#id_capteur, reference, type, date_installation, statut, ##id_conteneur)

Mesure(#id_mesure, valeur, datetime, unite, ##id_capteur)

Signalement(#id_Signalement, type, description, statut, photo_url, date_signalement, ##id_conteneur, ##id_user)

User(#id_user, nom, prenom, email, adresse, date_inscription, point_total, avatar_url, telephone)

Role(#id_role, nom, description)

User_role(#id_user, #id_role, date_attribution)  // Clé composite

Badge(#id_Badge, nom, description, icon_url, niveau, ##id_Defi)  // FK vers Defi car un badge est souvent lié à un défi spécifique

User_Badge(#id_user, #id_badge, date_obtention)

Defi(#id_Defi, titre, description, statut, points_recompense, date_debut, date_fin)

Participation_Defi(#id_user, #id_defi, progression)

Tournee(#id_Tournee, date_, heure_debut, heure_fin, statut, ##id_type_Tournee, ##Matricule)

type_Tournee(#id_type_Tournee, libelle)

Vehicule(#Matricule, marque, modele, type_vehicule, capacite)

Etape_Tournee(#id_Tournee, #id_conteneur, ordre, heure_prevue)
