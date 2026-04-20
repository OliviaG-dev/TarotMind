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
  while (total >= 22) {
    total = sumDigits(total)
  }
  return total
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
    upright: "Aujourd'hui, laisse-toi porter par l'inattendu. Une belle surprise pourrait se presenter si tu restes ouvert(e).",
    reversed: "Prends le temps de reflechir avant d'agir. L'impulsivite pourrait te jouer des tours aujourd'hui.",
  },
  '1': {
    upright: 'Tu as toutes les ressources en main. Lance-toi, les etoiles sont alignees pour toi.',
    reversed: 'Attention a ne pas te disperser. Concentre-toi sur une seule chose a la fois.',
  },
  '2': {
    upright: "Ecoute ton intuition aujourd'hui, elle ne te trompera pas. Le silence porte des reponses.",
    reversed: "Des informations cachees pourraient emerger. Reste attentif(ve) aux signaux subtils.",
  },
  '3': {
    upright: "Journee de creativite et d'abondance. Laisse ta nature genereuse s'exprimer.",
    reversed: 'Prends soin de toi avant de prendre soin des autres. Tu merites aussi ton attention.',
  },
  '4': {
    upright: "Structure et discipline seront tes allies aujourd'hui. Pose des bases solides.",
    reversed: "Assouplis un peu tes regles. Trop de rigidite pourrait bloquer de belles opportunites.",
  },
  '5': {
    upright: "Cherche un conseil aupres de quelqu'un de confiance. La sagesse partagee eclaire le chemin.",
    reversed: "Questionne les conventions. Ta propre verite vaut autant que celle des autres.",
  },
  '6': {
    upright: "Un choix important se presente. Suis ton coeur, il connait deja la reponse.",
    reversed: "Evite les decisions hatives en amour ou en amitie. Laisse les choses murir.",
  },
  '7': {
    upright: "Avance avec determination ! Rien ne peut t'arreter quand tu es aligne(e) avec ton objectif.",
    reversed: "Ralentis un peu. La victoire viendra, mais pas en forcant les choses.",
  },
  '8': {
    upright: "La justice est de ton cote. Agis avec integrite et les choses s'equilibreront.",
    reversed: "Un desequilibre demande ton attention. Sois honnete avec toi-meme.",
  },
  '9': {
    upright: "Accorde-toi un moment de solitude et de reflexion. Les reponses sont en toi.",
    reversed: "Ne t'isole pas trop. Parfois, la lumiere vient des autres.",
  },
  '10': {
    upright: "Les cycles tournent en ta faveur. Un changement positif est en route.",
    reversed: "Accepte ce que tu ne peux pas controler. Chaque fin porte un nouveau depart.",
  },
  '11': {
    upright: "Ta douceur est ta force aujourd'hui. Aborde les defis avec calme et confiance.",
    reversed: "Ne laisse pas le doute miner ta confiance. Tu es plus fort(e) que tu ne le penses.",
  },
  '12': {
    upright: "Lache prise sur ce qui ne te sert plus. Un nouveau point de vue t'attend.",
    reversed: "Arrete de t'accrocher a ce qui est familier par peur du changement.",
  },
  '13': {
    upright: "Quelque chose se termine pour laisser place au renouveau. Accueille la transformation.",
    reversed: "Resister au changement ne fait que prolonger l'inconfort. Laisse aller.",
  },
  '14': {
    upright: "Journee d'harmonie et d'equilibre. Trouve le juste milieu en toute chose.",
    reversed: "Un exces quelque part demande un reajustement. Retrouve ta mesure.",
  },
  '15': {
    upright: "Regarde en face ce qui te retient. La conscience est le premier pas vers la liberte.",
    reversed: "Tu es en train de te liberer d'un schema qui ne te sert plus. Continue.",
  },
  '16': {
    upright: "Un bouleversement peut sembler destabilisant, mais il apporte la verite et le renouveau.",
    reversed: "Le changement arrive doucement. Prepare-toi interieurement.",
  },
  '17': {
    upright: "L'espoir brille fort aujourd'hui. Connecte-toi a ce qui t'inspire profondement.",
    reversed: "Ne perds pas espoir. Meme dans l'obscurite, une etoile veille sur toi.",
  },
  '18': {
    upright: "Tes emotions sont riches aujourd'hui. Explore-les sans jugement.",
    reversed: "Dissipe la confusion en revenant aux faits. Tout n'est pas ce qu'il semble.",
  },
  '19': {
    upright: "Journee lumineuse et joyeuse ! Profite de cette energie solaire et partage-la.",
    reversed: "La joie est la, meme si elle se cache un peu. Cherche-la dans les petites choses.",
  },
  '20': {
    upright: "Un appel interieur resonne. C'est le moment de te reconnecter a ta vocation.",
    reversed: "Ne repousse pas l'introspection. Ce que tu evites a besoin d'etre entendu.",
  },
  '21': {
    upright: "Accomplissement et plenitude. Celebre le chemin parcouru, tu le merites.",
    reversed: "Tu es presque au bout. Les dernieres etapes demandent patience et perseverance.",
  },
}

export function getDailyMessage(cardId: string, reversed: boolean): string {
  const messages = DAILY_MESSAGES[cardId]
  if (!messages) return "Laisse cette carte t'inspirer aujourd'hui."
  return reversed ? messages.reversed : messages.upright
}

const MONTHLY_MESSAGES: Record<string, string> = {
  '0': "Un mois d'ouverture et de nouveaux departs. Ose sortir des sentiers battus.",
  '1': "Ce mois-ci, tu as les outils pour creer ce que tu veux. Passe a l'action.",
  '2': "Un mois tourne vers l'interieur. Fais confiance a ton intuition pour te guider.",
  '3': "Mois de fertilite et de creation. Tes projets peuvent eclore magnifiquement.",
  '4': "Construis des fondations solides ce mois-ci. La structure apporte la serenite.",
  '5': "Cherche l'enseignement et la transmission. Un mentor ou une sagesse t'attend.",
  '6': "L'amour et les relations sont au coeur de ce mois. Ecoute ton coeur.",
  '7': "Un mois de mouvement et de progres. Ta determination sera recompensee.",
  '8': "Equilibre et justice guident ce mois. Les decisions prises seront les bonnes.",
  '9': "Mois de reflexion et de sagesse interieure. Prends du recul pour mieux voir.",
  '10': "Les choses bougent ! Un tournant important se dessine ce mois-ci.",
  '11': "Force interieure et douceur sont tes alliees. Tu peux tout traverser.",
  '12': "Un mois pour lacher prise et voir les choses sous un angle nouveau.",
  '13': "Transformation profonde ce mois-ci. Laisse l'ancien partir pour accueillir le neuf.",
  '14': "Harmonie et patience portent ce mois. Trouve l'equilibre dans chaque domaine.",
  '15': "Prends conscience de ce qui te limite. La liberation commence par la lucidite.",
  '16': "Un mois de revelations. Ce qui s'ecroule laissera place a du plus authentique.",
  '17': "L'espoir illumine ce mois. Laisse-toi inspirer et reve en grand.",
  '18': "Mois riche en emotions et en intuitions. Explore tes profondeurs sans crainte.",
  '19': "Un mois lumineux et energisant. La joie et la vitalite sont au rendez-vous.",
  '20': "Un appel au renouveau resonne ce mois-ci. Il est temps de se reinventer.",
  '21': "Mois d'accomplissement et de plenitude. Reconnais tout le chemin parcouru.",
}

const YEARLY_MESSAGES: Record<string, string> = {
  '0': "Annee de liberte et d'exploration. Laisse-toi porter par les rencontres et les surprises.",
  '1': "Annee de commencements. Tu poses les premieres pierres de quelque chose d'important.",
  '2': "Annee d'intuition et de patience. Les reponses viendront de l'interieur.",
  '3': "Annee de creativite et d'abondance. Tout ce que tu nourris peut grandir.",
  '4': "Annee de construction et de stabilite. Les efforts fournis porteront leurs fruits.",
  '5': "Annee de transmission et d'apprentissage. Entoure-toi de ceux qui t'elevent.",
  '6': "Annee placee sous le signe de l'amour et des choix importants du coeur.",
  '7': "Annee de victoires et de progres. Ta volonte te mene loin.",
  '8': "Annee de justice et d'equilibre. Les consequences de tes actes s'alignent.",
  '9': "Annee de sagesse et d'introspection. Le recul t'offre une clarte precieuse.",
  '10': "Annee de grands changements et de cycles qui tournent. Accueille le mouvement.",
  '11': "Annee de courage et de maitrise interieure. Ta douceur est ta plus grande force.",
  '12': "Annee de lacher-prise et de nouvelles perspectives. Vois le monde autrement.",
  '13': "Annee de transformation profonde. Des fins necessaires ouvrent des portes neuves.",
  '14': "Annee d'harmonie et de guerison. L'equilibre se restaure dans chaque domaine.",
  '15': "Annee de prise de conscience. Ce que tu liberes ne pourra plus te retenir.",
  '16': "Annee de bouleversements porteurs de verite. Le renouveau nait de la rupture.",
  '17': "Annee d'espoir et d'inspiration. Les etoiles sont alignees pour toi.",
  '18': "Annee d'emotions profondes et d'intuition. Fais confiance a ce que tu ressens.",
  '19': "Annee solaire et joyeuse. La vitalite et le succes t'accompagnent.",
  '20': "Annee de renaissance et d'eveil. Un nouvel appel interieur guide tes pas.",
  '21': "Annee d'accomplissement total. Tu recoltes les fruits de tout ce que tu as seme.",
}

export function getMonthlyMessage(cardId: string): string {
  return MONTHLY_MESSAGES[cardId] ?? "Ce mois-ci, laisse cette carte guider ta reflexion."
}

export function getYearlyMessage(cardId: string): string {
  return YEARLY_MESSAGES[cardId] ?? "Cette annee, laisse cette carte eclairer ton chemin."
}
