import { MAJOR_ARCANA } from '../data/tarotDeck'

const STORAGE_KEY = 'tarotmind.dailyCard.v2'

interface DailyCardData {
  date: string
  cardId: string
  reversed: boolean
}

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function sumDigits(n: number): number {
  let s = 0
  while (n > 0) {
    s += n % 10
    n = Math.floor(n / 10)
  }
  return s
}

function digitsToArcanum(str: string): number {
  const digits = str.replace(/\D/g, '')
  let total = 0
  for (const ch of digits) {
    total += Number(ch)
  }
  while (total > 22) {
    total = sumDigits(total)
  }
  return total === 22 ? 0 : total
}

export function getMonthlyCard() {
  const d = new Date()
  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  const idx = digitsToArcanum(key)
  const card = MAJOR_ARCANA[idx]!
  return { card, label: new Date(d.getFullYear(), d.getMonth()).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) }
}

export function getYearlyCard() {
  const d = new Date()
  const idx = digitsToArcanum(String(d.getFullYear()))
  const card = MAJOR_ARCANA[idx]!
  return { card, label: String(d.getFullYear()) }
}

export function getDailyCard() {
  const today = todayKey()

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw) as DailyCardData
      if (saved.date === today) {
        const card = MAJOR_ARCANA.find((c) => c.id === saved.cardId)
        if (card) return { card, reversed: false, date: today }
      }
    }
  } catch {
    // ignore
  }

  const idx = digitsToArcanum(today)
  const card = MAJOR_ARCANA[idx]!

  const data: DailyCardData = { date: today, cardId: card.id, reversed: false }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

  return { card, reversed: false, date: today }
}

const DAILY_MESSAGES: Record<string, { upright: string; reversed: string }> = {
  '0': {
    upright: "Aujourd'hui, laisse-toi porter par l'inattendu. Une belle surprise pourrait se présenter si tu restes ouvert(e).",
    reversed: "Prends le temps de réfléchir avant d'agir. L'impulsivité pourrait te jouer des tours aujourd'hui.",
  },
  '1': {
    upright: 'Tu as toutes les ressources en main. Lance-toi, les étoiles sont alignées pour toi.',
    reversed: 'Attention à ne pas te disperser. Concentre-toi sur une seule chose à la fois.',
  },
  '2': {
    upright: "Écoute ton intuition aujourd'hui, elle ne te trompera pas. Le silence porte des réponses.",
    reversed: "Des informations cachées pourraient émerger. Reste attentif(ve) aux signaux subtils.",
  },
  '3': {
    upright: "Journée de créativité et d'abondance. Laisse ta nature généreuse s'exprimer.",
    reversed: 'Prends soin de toi avant de prendre soin des autres. Tu mérites aussi ton attention.',
  },
  '4': {
    upright: "Structure et discipline seront tes alliés aujourd'hui. Pose des bases solides.",
    reversed: "Assouplis un peu tes règles. Trop de rigidité pourrait bloquer de belles opportunités.",
  },
  '5': {
    upright: "Cherche un conseil auprès de quelqu'un de confiance. La sagesse partagée éclaire le chemin.",
    reversed: "Questionne les conventions. Ta propre vérité vaut autant que celle des autres.",
  },
  '6': {
    upright: "Un choix important se présente. Suis ton cœur, il connaît déjà la réponse.",
    reversed: "Évite les décisions hâtives en amour ou en amitié. Laisse les choses mûrir.",
  },
  '7': {
    upright: "Avance avec détermination ! Rien ne peut t'arrêter quand tu es aligné(e) avec ton objectif.",
    reversed: "Ralentis un peu. La victoire viendra, mais pas en forçant les choses.",
  },
  '8': {
    upright: "La justice est de ton côté. Agis avec intégrité et les choses s'équilibreront.",
    reversed: "Un déséquilibre demande ton attention. Sois honnête avec toi-même.",
  },
  '9': {
    upright: "Accorde-toi un moment de solitude et de réflexion. Les réponses sont en toi.",
    reversed: "Ne t'isole pas trop. Parfois, la lumière vient des autres.",
  },
  '10': {
    upright: "Les cycles tournent en ta faveur. Un changement positif est en route.",
    reversed: "Accepte ce que tu ne peux pas contrôler. Chaque fin porte un nouveau départ.",
  },
  '11': {
    upright: "Ta douceur est ta force aujourd'hui. Aborde les défis avec calme et confiance.",
    reversed: "Ne laisse pas le doute miner ta confiance. Tu es plus fort(e) que tu ne le penses.",
  },
  '12': {
    upright: "Lâche prise sur ce qui ne te sert plus. Un nouveau point de vue t'attend.",
    reversed: "Arrête de t'accrocher à ce qui est familier par peur du changement.",
  },
  '13': {
    upright: "Quelque chose se termine pour laisser place au renouveau. Accueille la transformation.",
    reversed: "Résister au changement ne fait que prolonger l'inconfort. Laisse aller.",
  },
  '14': {
    upright: "Journée d'harmonie et d'équilibre. Trouve le juste milieu en toute chose.",
    reversed: "Un excès quelque part demande un réajustement. Retrouve ta mesure.",
  },
  '15': {
    upright: "Regarde en face ce qui te retient. La conscience est le premier pas vers la liberté.",
    reversed: "Tu es en train de te libérer d'un schéma qui ne te sert plus. Continue.",
  },
  '16': {
    upright: "Un bouleversement peut sembler déstabilisant, mais il apporte la vérité et le renouveau.",
    reversed: "Le changement arrive doucement. Prépare-toi intérieurement.",
  },
  '17': {
    upright: "L'espoir brille fort aujourd'hui. Connecte-toi à ce qui t'inspire profondément.",
    reversed: "Ne perds pas espoir. Même dans l'obscurité, une étoile veille sur toi.",
  },
  '18': {
    upright: "Tes émotions sont riches aujourd'hui. Explore-les sans jugement.",
    reversed: "Dissipe la confusion en revenant aux faits. Tout n'est pas ce qu'il semble.",
  },
  '19': {
    upright: "Journée lumineuse et joyeuse ! Profite de cette énergie solaire et partage-la.",
    reversed: "La joie est là, même si elle se cache un peu. Cherche-la dans les petites choses.",
  },
  '20': {
    upright: "Un appel intérieur résonne. C'est le moment de te reconnecter à ta vocation.",
    reversed: "Ne repousse pas l'introspection. Ce que tu évites a besoin d'être entendu.",
  },
  '21': {
    upright: "Accomplissement et plénitude. Célèbre le chemin parcouru, tu le mérites.",
    reversed: "Tu es presque au bout. Les dernières étapes demandent patience et persévérance.",
  },
}

export function getDailyMessage(cardId: string, reversed: boolean): string {
  const messages = DAILY_MESSAGES[cardId]
  if (!messages) return "Laisse cette carte t'inspirer aujourd'hui."
  return reversed ? messages.reversed : messages.upright
}

const MONTHLY_MESSAGES: Record<string, string> = {
  '0': "Un mois d'ouverture et de nouveaux départs. Ose sortir des sentiers battus.",
  '1': "Ce mois-ci, tu as les outils pour créer ce que tu veux. Passe à l'action.",
  '2': "Un mois tourné vers l'intérieur. Fais confiance à ton intuition pour te guider.",
  '3': "Mois de fertilité et de création. Tes projets peuvent éclore magnifiquement.",
  '4': "Construis des fondations solides ce mois-ci. La structure apporte la sérénité.",
  '5': "Cherche l'enseignement et la transmission. Un mentor ou une sagesse t'attend.",
  '6': "L'amour et les relations sont au cœur de ce mois. Écoute ton cœur.",
  '7': "Un mois de mouvement et de progrès. Ta détermination sera récompensée.",
  '8': "Équilibre et justice guident ce mois. Les décisions prises seront les bonnes.",
  '9': "Mois de réflexion et de sagesse intérieure. Prends du recul pour mieux voir.",
  '10': "Les choses bougent ! Un tournant important se dessine ce mois-ci.",
  '11': "Force intérieure et douceur sont tes alliées. Tu peux tout traverser.",
  '12': "Un mois pour lâcher prise et voir les choses sous un angle nouveau.",
  '13': "Transformation profonde ce mois-ci. Laisse l'ancien partir pour accueillir le neuf.",
  '14': "Harmonie et patience portent ce mois. Trouve l'équilibre dans chaque domaine.",
  '15': "Prends conscience de ce qui te limite. La libération commence par la lucidité.",
  '16': "Un mois de révélations. Ce qui s'écroule laissera place à du plus authentique.",
  '17': "L'espoir illumine ce mois. Laisse-toi inspirer et rêve en grand.",
  '18': "Mois riche en émotions et en intuitions. Explore tes profondeurs sans crainte.",
  '19': "Un mois lumineux et énergisant. La joie et la vitalité sont au rendez-vous.",
  '20': "Un appel au renouveau résonne ce mois-ci. Il est temps de se réinventer.",
  '21': "Mois d'accomplissement et de plénitude. Reconnais tout le chemin parcouru.",
}

const YEARLY_MESSAGES: Record<string, string> = {
  '0': "Année de liberté et d'exploration. Laisse-toi porter par les rencontres et les surprises.",
  '1': "Année de commencements. Tu poses les premières pierres de quelque chose d'important.",
  '2': "Année d'intuition et de patience. Les réponses viendront de l'intérieur.",
  '3': "Année de créativité et d'abondance. Tout ce que tu nourris peut grandir.",
  '4': "Année de construction et de stabilité. Les efforts fournis porteront leurs fruits.",
  '5': "Année de transmission et d'apprentissage. Entoure-toi de ceux qui t'élèvent.",
  '6': "Année placée sous le signe de l'amour et des choix importants du cœur.",
  '7': "Année de victoires et de progrès. Ta volonté te mène loin.",
  '8': "Année de justice et d'équilibre. Les conséquences de tes actes s'alignent.",
  '9': "Année de sagesse et d'introspection. Le recul t'offre une clarté précieuse.",
  '10': "Année de grands changements et de cycles qui tournent. Accueille le mouvement.",
  '11': "Année de courage et de maîtrise intérieure. Ta douceur est ta plus grande force.",
  '12': "Année de lâcher-prise et de nouvelles perspectives. Vois le monde autrement.",
  '13': "Année de transformation profonde. Des fins nécessaires ouvrent des portes neuves.",
  '14': "Année d'harmonie et de guérison. L'équilibre se restaure dans chaque domaine.",
  '15': "Année de prise de conscience. Ce que tu libères ne pourra plus te retenir.",
  '16': "Année de bouleversements porteurs de vérité. Le renouveau naît de la rupture.",
  '17': "Année d'espoir et d'inspiration. Les étoiles sont alignées pour toi.",
  '18': "Année d'émotions profondes et d'intuition. Fais confiance à ce que tu ressens.",
  '19': "Année solaire et joyeuse. La vitalité et le succès t'accompagnent.",
  '20': "Année de renaissance et d'éveil. Un nouvel appel intérieur guide tes pas.",
  '21': "Année d'accomplissement total. Tu récoltes les fruits de tout ce que tu as semé.",
}

export function getMonthlyMessage(cardId: string): string {
  return MONTHLY_MESSAGES[cardId] ?? "Ce mois-ci, laisse cette carte guider ta réflexion."
}

export function getYearlyMessage(cardId: string): string {
  return YEARLY_MESSAGES[cardId] ?? "Cette année, laisse cette carte éclairer ton chemin."
}
