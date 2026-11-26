# Mise en ligne (seulement après « publie »)

Rien ci-dessous n’a été fait. Ne pas lancer `wrangler deploy`, ne pas créer de produit, de prix ou de webhook tant que ce n’est pas demandé.

## Déjà en place côté Stripe (vérifié en lecture seule)

- Compte France, identifié, paiements et virements activés.
- Produit `prod_VcGsxG3KPu0cTb` « Accès ventes mimiqui ».
- Prix **à réutiliser** : `price_1Ub2KVRPA7ND4soIl9jsR9Ry` (2,99 € / semaine). Ne pas en créer un autre.
- Payment Link public déjà sur l’ancien site : `plink_1Ub2OIRPA7ND4soIGfQlY589`.

## Étapes

1. **Secrets Worker** (jamais dans le chat ni le dépôt), via `wrangler secret put` ou le tableau de bord :
   - `STRIPE_SECRET_KEY` (idéalement une **clé restreinte** `rk_live_…`, pas la clé `sk_live` trop large)
   - `STRIPE_WEBHOOK_SECRET` (après l’étape 3)
   - `SESSION_SECRET` (chaîne longue aléatoire)
   - `RESEND_API_KEY` (si l’envoi des liens magiques est prêt)
2. Créer dans Cloudflare (compte déjà lié à mimiqui.fr) :
   - un namespace KV, une base D1 `mimiqui-abos`, appliquer `migrations/0001_init.sql`
   - renseigner les `id` dans `wrangler.jsonc`
   - activer un sous-domaine workers.dev seulement si besoin ; la route utile est `mimiqui.fr/api/*` (et `www`)
   - **fail closed** sur la route (si le quota est dépassé, bloquer, ne pas servir GitHub Pages)
3. **Webhook Stripe** (à créer seulement à la mise en ligne) :
   - URL : `https://mimiqui.fr/api/webhook/stripe`
   - événements : `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`
   - copier le `whsec_…` en secret Worker
4. Dans le Dashboard Stripe : URL des conditions (`https://mimiqui.fr/conditions-abonnement.html`) pour la case d’acceptation Checkout (rétractation L. 221-28). Mettre à jour ou désactiver l’ancien Payment Link (son URL de succès ne pose pas encore le cookie).
5. `npm run build:ventes` puis `wrangler kv bulk put data/bulk.json --binding VENTES`.
6. `wrangler deploy` (seulement après « publie »).
7. **Retirer ou cesser de servir** les fichiers de ventes encore publics (voir liste ci-dessous), puis vider le cache Cloudflare.
8. Tester en live : paiement (d’abord en mode test si un second Worker/env test existe), webhook, cookie, restauration e-mail, résiliation, 404 sur `data-archive-site-ventes.js`.

## Fichiers à retirer à la mise en ligne

### Obligatoire pour que l’archive ne soit plus téléchargeable

- `data-archive-site-ventes.js`

### Plus utilisés par la nouvelle page archive, à retirer du HTML (déjà fait dans cette PR) ; les fichiers peuvent être supprimés du dépôt à la mise en ligne s’ils ne servent plus ailleurs

- `archive-ventes-data.js` (vérifier qu’aucune autre page ne le charge)

### Encore utilisés par d’autres pages (fiches / séries) — **même données en clair**. À retirer seulement quand ces pages passeront aussi par l’API, sinon elles cassent

- `data-set-de-base-ventes.js` (`set-de-base.html`)
- les 151 fichiers `data-<pokemon>-ventes.js` (pages `cartes-…-ventes.html`)
- `ventes-30anniv.js`, `ventes-chaos.js`, `ventes-equilibre.js`, `ventes-nuit-noire.js`, `ventes-sets-data.js`
- `registre-ventes-data.js`, `data-top-ventes-semaine.js`

L’historique Git public conservera une copie des ventes déjà publiées.

## Encore nécessaire de la part du propriétaire

- Confirmer l’usage de la clé (idéalement une clé restreinte) et le secret de webhook, **par formulaire sécurisé**, pas dans le chat.
- Configurer l’expéditeur d’e-mails (Resend + domaine), sinon la restauration par lien magique attendra.
- Compléter les mentions légales encore marquées [À COMPLÉTER] : forme, SIRET, adresse, TVA le cas échéant, médiateur de la consommation.
- Dire « publie » pour le déploiement et la fusion de la PR.
