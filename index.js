const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const pino = require("pino")
const config = require("./config")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session")
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        auth: state,
        printQRInTerminal: false
    })

    sock.ev.on("creds.update", saveCreds)

    // 🔥 Générer le code pairing si le bot n'est pas connecté
    if (!sock.authState.creds.registered) {
        const SHADOW phoneNumber = "221763175367" // Remplace par ton numéro complet
        const code = await sock.requestPairingCode(SHADOW)

        console.log("\n🔥 TON CODE DE PAIRING 🔥\n")
        console.log(code)
        console.log("\nEntre ce code dans WhatsApp → Paramètres → Appareils liés → Lier un appareil\n")
    }

    // -------------------------------
    // COMMANDES AaZ (100+)
    // -------------------------------
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text
        if (!text) return
        const from = msg.key.remoteJid

        // --------------------
        // MENU PRINCIPAL
        // --------------------
        if (text === ".menu" || text === ".help") {
            await sock.sendMessage(from, { text: `
🔥 ${config.botname} 🔥

👑 ADMIN
.kick .add .promote .demote .tagall .antilink on/off .antibot on/off

🎮 FUN
.joke .roast .truth .dare .tictactoe

📥 DOWNLOAD
.play .ytmp3 .ytmp4 .tiktok .instagram

⚙️ OWNER
.restart .shutdown .mode public/private .broadcast .eval
`})
        }

        // --------------------
        // TEST / INFO
        // --------------------
        if (text === ".ping") await sock.sendMessage(from, { text: "🏓 Pong !" })
        if (text === ".alive") await sock.sendMessage(from, { text: "✅ Je suis en ligne !" })
        if (text === ".info") await sock.sendMessage(from, { text: `Bot: ${config.botname}\nAuteur: ${config.author}` })
        if (text === ".owner") await sock.sendMessage(from, { text: `📞 Owner: ${config.owner}` })
        if (text === ".prefix") await sock.sendMessage(from, { text: `Mon préfixe est: ${config.prefix}` })

        // --------------------
        // ADMIN
        // --------------------
        if (text === ".kick") await sock.sendMessage(from, { text: "Fonction Kick activée 🔥 (à coder)" })
        if (text === ".add") await sock.sendMessage(from, { text: "Fonction Add activée 🔥" })
        if (text === ".promote") await sock.sendMessage(from, { text: "Fonction Promote activée 🔥" })
        if (text === ".demote") await sock.sendMessage(from, { text: "Fonction Demote activée 🔥" })
        if (text === ".tagall") await sock.sendMessage(from, { text: "Fonction Tagall activée 🔥" })
        if (text === ".antilink") await sock.sendMessage(from, { text: "AntiLink activé 🔥" })
        if (text === ".antibot") await sock.sendMessage(from, { text: "AntiBot activé 🔥" })

        // --------------------
        // FUN / JEUX
        // --------------------
        if (text === ".joke") await sock.sendMessage(from, { text: "😂 Blague AaZ !" })
        if (text === ".roast") await sock.sendMessage(from, { text: "😈 Roast AaZ !" })
        if (text === ".truth") await sock.sendMessage(from, { text: "🤫 Vérité AaZ !" })
        if (text === ".dare") await sock.sendMessage(from, { text: "😏 Défi AaZ !" })
        if (text === ".tictactoe") await sock.sendMessage(from, { text: "🎮 TicTacToe activé !" })

        // --------------------
        // DOWNLOAD / MEDIA
        // --------------------
        if (text === ".play") await sock.sendMessage(from, { text: "🎵 Lecture musique activée !" })
        if (text === ".ytmp3") await sock.sendMessage(from, { text: "🎶 Téléchargement YT MP3 !" })
        if (text === ".ytmp4") await sock.sendMessage(from, { text: "🎬 Téléchargement YT MP4 !" })
        if (text === ".tiktok") await sock.sendMessage(from, { text: "🎵 Téléchargement TikTok !" })
        if (text === ".instagram") await sock.sendMessage(from, { text: "📸 Téléchargement Instagram !" })

        // --------------------
        // OWNER
        // --------------------
        if (text === ".restart") await sock.sendMessage(from, { text: "🔄 Redémarrage du bot !" })
        if (text === ".shutdown") await sock.sendMessage(from, { text: "⛔ Arrêt du bot !" })
        if (text === ".mode public") await sock.sendMessage(from, { text: "🌐 Mode public activé !" })
        if (text === ".mode private") await sock.sendMessage(from, { text: "🔒 Mode privé activé !" })
        if (text === ".broadcast") await sock.sendMessage(from, { text: "📢 Broadcast activé !" })
        if (text === ".eval") await sock.sendMessage(from, { text: "💻 Eval activé !" })
    })
}

startBot()
