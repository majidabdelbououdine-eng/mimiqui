/* Ventes terminées retirées de ce fichier public : elles sont servies par /api/verrou (cadenas abonnés). */
/* Archive permanente des ventes du Set de Base — Le Coin de Mimiqui.
 *
 * Ce fichier se remplit à la main (pas de relevé automatique).
 * Ajouter une vente : copier un objet à la FIN du tableau, puis
 * enregistrer le fichier. Ne rien inventer : uniquement une vente
 * eBay vraiment relevée (prix, date, lien).
 *
 * La page ignore un doublon si le même id eBay (itm) existe déjà.
 * Chaque vente garde sa devise d'origine (USD ou EUR), sans conversion.
 * Les ventes du Set de Base restent visibles dans l’archive même après
 * 365 jours.
 *
 * Exemple à copier (remplacer les valeurs par celles de la vente) :
 *
 *   {
 *     "id": "128080201759",
 *     "carte": "Abra",
 *     "numero": "043/102",
 *     "set": "Set de Base",
 *     "langue": "fr",
 *     "prix": 8.99,
 *     "devise": "USD",
 *     "date": "2026-11-08",
 *     "etat": "",
 *     "edition": "1st",
 *     "photo": "",
 *     "lien": "https://www.ebay.com/itm/128080201759"
 *   }
 *
 * Champs :
 *   id       numéro de l’annonce eBay (itm), obligatoire
 *   carte    nom de la carte
 *   numero   numéro dans le set, ex. "043/102"
 *   set      toujours "Set de Base"
 *   langue   "fr", "en" ou "ja"
 *   prix     montant, sans frais de port
 *   devise   "USD" ou "EUR" (ne pas convertir)
 *   date     "AAAA-MM-JJ"
 *   etat     vide, ou "gradee PSA 9", "gradee CGC 10", "nm", "ex"…
 *   edition  "1st" (1re éd.), "unl" (illimité) ou "?"
 *   photo    chemin local de la vignette, ou ""
 *   lien     URL eBay de l’annonce
 *
 * Graine : 100 ventes réelles en USD (6 oct. – 9 nov. 2026).
 * Ajout du 26/11/2026 : 385 ventes eBay en EUR, du 12 au 26 novembre 2026,
 * relevées (aucune inventée). 14 cartes sans relevé sur cette période
 * restent sans nouvelle vente.
 */
window.SET_DE_BASE_VENTES =
[];
