import type {
  Gender,
  GoalId,
  RelationshipStatus,
  WorkSituation,
} from '../types/tarot'

const REL: Record<RelationshipStatus, string> = {
  single: 'célibataire',
  couple: 'en couple',
  complicated: 'dans une situation amoureuse complexe',
  separation: 'en séparation',
  prefer_not: 'avec une vie amoureuse que tu préfères garder privée',
}

const GEND: Record<Gender, string> = {
  female: 'une femme',
  male: 'un homme',
  non_binary: 'une personne non binaire',
  other: 'une personne',
  prefer_not: 'une personne',
}

const WORK: Record<WorkSituation, string> = {
  student: 'étudiant·e',
  employed: 'en emploi salarié',
  freelance: 'indépendant·e',
  seeking: 'en recherche d’emploi',
  retired: 'retraité·e',
  other: 'dans une situation professionnelle en évolution',
}

const GOALS: Record<GoalId, string> = {
  love: 'l’amour et les relations',
  money: 'la stabilité matérielle',
  wellbeing: 'le bien-être et l’équilibre intérieur',
}

export function profileOpeningLine(opts: {
  relationshipStatus: RelationshipStatus
  gender: Gender
  workSituation: WorkSituation
  goals: GoalId[]
}): string {
  const rel = REL[opts.relationshipStatus]
  const work = WORK[opts.workSituation]
  const goalPart =
    opts.goals.length > 0
      ? ` Tes objectifs du moment touchent surtout ${opts.goals.map((g) => GOALS[g]).join(', ')}.`
      : ''
  return `En tant que ${GEND[opts.gender]} ${rel}, tu es ${work}.${goalPart}`
}
