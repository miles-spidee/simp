"""
AI Evaluation Service — Rule-based candidate analysis engine.

Analyzes application data to produce scores for:
  - Sentiment (Positive / Neutral / Concern)
  - Commitment Score (0-100)
  - Communication Score (0-100)
  - Match Percentage (0-100)
  - Experience Summary
  - Strengths & Weaknesses
  - Resume Summary
  - Suggested Interview Questions
"""

import re
import math
from typing import Any, Optional


# ---------------------------------------------------------------------------
# Text utilities
# ---------------------------------------------------------------------------

def _word_count(text: str) -> int:
    return len(text.split()) if text else 0


def _count_keywords(text: str, keywords: list[str]) -> int:
    text_lower = text.lower()
    return sum(1 for kw in keywords if kw.lower() in text_lower)


def _sentence_count(text: str) -> int:
    sentences = re.split(r'[.!?]+', text)
    return max(1, len([s for s in sentences if s.strip()]))


def _avg_sentence_length(text: str) -> float:
    words = _word_count(text)
    sents = _sentence_count(text)
    return words / sents if sents else 0


def _clamp(val: float, lo: float = 0.0, hi: float = 100.0) -> int:
    return int(max(lo, min(hi, round(val))))


# ---------------------------------------------------------------------------
# Positive / Negative word banks
# ---------------------------------------------------------------------------

COMMITMENT_KEYWORDS = [
    "passionate", "dedicated", "motivated", "eager", "committed",
    "excited", "enthusiastic", "driven", "determined", "focused",
    "hardworking", "ambitious", "goal", "vision", "internship",
    "contribute", "learn", "grow", "opportunity", "career",
    "professional", "improve", "develop", "challenge", "ready",
    "apply", "gain", "real-world", "experience", "industry",
]

COMMS_POSITIVE = [
    "therefore", "however", "additionally", "furthermore",
    "in conclusion", "to summarize", "as a result", "consequently",
    "specifically", "for instance", "for example", "in particular",
    "I believe", "I have", "I enjoy", "I am confident",
]

CONCERN_KEYWORDS = [
    "uncertain", "not sure", "maybe", "might", "possibly",
    "I don't know", "difficult", "struggling", "never done",
    "no experience", "unsure",
]

TECH_KEYWORDS = [
    "python", "java", "javascript", "typescript", "react", "node",
    "fastapi", "flask", "django", "sql", "mysql", "postgres", "mongodb",
    "docker", "aws", "azure", "git", "api", "rest", "html", "css",
    "machine learning", "ai", "data", "deep learning", "pytorch", "tensorflow",
    "linux", "backend", "frontend", "full-stack", "devops", "cloud",
    "kotlin", "swift", "c++", "golang", "ruby", "php",
]

SOFT_SKILL_KEYWORDS = [
    "teamwork", "collaboration", "communication", "leadership",
    "problem-solving", "analytical", "creative", "adaptable",
    "time management", "responsible", "proactive", "initiative",
]


# ---------------------------------------------------------------------------
# Core Analyzers
# ---------------------------------------------------------------------------

def analyze_sentiment(motivation_text: str) -> str:
    """Returns 'Positive', 'Neutral', or 'Concern'."""
    if not motivation_text:
        return "Neutral"

    concern_score = _count_keywords(motivation_text, CONCERN_KEYWORDS)
    positive_score = _count_keywords(motivation_text, COMMITMENT_KEYWORDS)

    if concern_score >= 3 or positive_score < 2:
        return "Concern"
    if positive_score >= 5:
        return "Positive"
    return "Neutral"


def compute_commitment_score(motivation_text: str, relevant_experience: str = "") -> int:
    """Score 0-100 based on motivation depth and keyword richness."""
    if not motivation_text:
        return 20

    combined = f"{motivation_text} {relevant_experience}"
    wc = _word_count(combined)

    # Word-count baseline: 50-200 words maps to 30-70
    wc_score = _clamp((wc / 200.0) * 50.0 + 20.0)

    # Keyword density bonus (up to 30 points)
    kw_hits = _count_keywords(combined, COMMITMENT_KEYWORDS)
    kw_bonus = _clamp(kw_hits * 4.0, 0, 30)

    # Concern penalty
    concern_hits = _count_keywords(combined, CONCERN_KEYWORDS)
    concern_penalty = concern_hits * 8

    raw = wc_score + kw_bonus - concern_penalty
    return _clamp(raw, 5, 95)


def compute_comms_score(motivation_text: str, project_experience: str = "") -> int:
    """Score 0-100 based on writing quality signals."""
    if not motivation_text:
        return 15

    combined = f"{motivation_text} {project_experience}"
    wc = _word_count(combined)

    # Adequate length: 100+ words → good
    length_score = _clamp((wc / 150.0) * 40.0)

    # Average sentence length: ideal 12-20 words
    asl = _avg_sentence_length(combined)
    if 12 <= asl <= 20:
        structure_score = 35
    elif 8 <= asl < 12 or 20 < asl <= 28:
        structure_score = 22
    else:
        structure_score = 10

    # Transition word bonus
    transition_score = _clamp(_count_keywords(combined, COMMS_POSITIVE) * 3, 0, 25)

    raw = length_score + structure_score + transition_score
    return _clamp(raw, 10, 95)


def compute_match_percentage(
    skills_str: str,
    cgpa: float,
    project_experience: str,
    relevant_experience: str,
    internship_type: str,
) -> int:
    """Overall fit score 0-100."""
    score = 0.0

    # --- Skills (up to 30 pts) ---
    skills_text = f"{skills_str} {project_experience} {relevant_experience}"
    tech_hits = _count_keywords(skills_text, TECH_KEYWORDS)
    score += min(30.0, tech_hits * 4.0)

    # --- CGPA (up to 25 pts) ---
    if cgpa >= 9.0:
        score += 25
    elif cgpa >= 8.0:
        score += 20
    elif cgpa >= 7.0:
        score += 14
    elif cgpa >= 6.0:
        score += 8
    else:
        score += 3

    # --- Project Depth (up to 20 pts) ---
    proj_wc = _word_count(project_experience)
    score += min(20.0, (proj_wc / 100.0) * 10.0)

    # --- Relevant Experience (up to 15 pts, stipend/industrial types weigh more) ---
    exp_wc = _word_count(relevant_experience)
    exp_weight = 15.0 if internship_type in ("stipend", "industrial") else 8.0
    score += min(exp_weight, (exp_wc / 80.0) * exp_weight)

    # --- Soft skills presence (up to 10 pts) ---
    soft_hits = _count_keywords(skills_text, SOFT_SKILL_KEYWORDS)
    score += min(10.0, soft_hits * 2.5)

    return _clamp(score, 5, 98)


def extract_tech_skills(skills_str: str, project_experience: str) -> list[str]:
    """Extract recognized tech skills from text."""
    combined = f"{skills_str} {project_experience}".lower()
    found = []
    for kw in TECH_KEYWORDS:
        if kw in combined and kw not in found:
            found.append(kw.title())
    return found[:8]


def build_experience_summary(
    project_experience: str,
    relevant_experience: str,
    skills: list[str],
    internship_type: str,
) -> str:
    """Generate a 1-2 sentence AI summary of candidate's experience."""
    tech = extract_tech_skills(" ".join(skills), project_experience)
    tech_str = ", ".join(tech[:4]) if tech else "various technologies"

    exp_text = relevant_experience or project_experience
    wc = _word_count(exp_text)

    if wc >= 80:
        depth = "demonstrates strong practical depth"
    elif wc >= 30:
        depth = "shows foundational hands-on experience"
    else:
        depth = "has limited documented experience"

    type_note = {
        "stipend": "Candidate profile appears suitable for a compensated role.",
        "industrial": "Profile shows industrial applicability.",
        "research": "Research aptitude noted from portfolio review.",
        "free": "Entry-level profile with learning orientation.",
        "paid": "Paid internship candidate with relevant background.",
        "corporate": "Corporate environment readiness detected.",
    }.get(internship_type, "")

    summary = f"Candidate {depth} with proficiency in {tech_str}. {type_note}".strip()
    return summary


def identify_strengths(
    skills_str: str,
    project_experience: str,
    relevant_experience: str,
    cgpa: float,
    motivation_text: str,
) -> list[str]:
    """Return up to 4 AI-identified strengths."""
    strengths = []
    combined = f"{skills_str} {project_experience} {relevant_experience} {motivation_text}".lower()

    if cgpa >= 8.5:
        strengths.append(f"Strong academic record (CGPA {cgpa:.2f})")
    elif cgpa >= 7.5:
        strengths.append(f"Solid academic foundation (CGPA {cgpa:.2f})")

    tech_hits = _count_keywords(combined, TECH_KEYWORDS)
    if tech_hits >= 5:
        strengths.append("Broad technical skill set across multiple domains")
    elif tech_hits >= 3:
        strengths.append("Relevant technical skills aligned to role")

    if "project" in combined or "developed" in combined or "built" in combined:
        strengths.append("Demonstrable project-building experience")

    if _count_keywords(combined, SOFT_SKILL_KEYWORDS) >= 3:
        strengths.append("Strong communication and interpersonal skills indicated")

    commitment = compute_commitment_score(motivation_text)
    if commitment >= 70:
        strengths.append("Highly motivated with clear career goals")

    if "github" in combined or "portfolio" in combined or "open source" in combined:
        strengths.append("Active online presence and public portfolio")

    return strengths[:4]


def identify_weaknesses(
    skills_str: str,
    project_experience: str,
    relevant_experience: str,
    cgpa: float,
    motivation_text: str,
    internship_type: str,
) -> list[str]:
    """Return up to 3 AI-identified gaps."""
    gaps = []
    combined = f"{skills_str} {project_experience} {relevant_experience} {motivation_text}".lower()

    if cgpa < 6.5:
        gaps.append("Academic performance below typical threshold")

    exp_wc = _word_count(relevant_experience)
    if internship_type in ("stipend", "industrial") and exp_wc < 20:
        gaps.append("Limited documented relevant professional experience")

    tech_hits = _count_keywords(combined, TECH_KEYWORDS)
    if tech_hits < 2:
        gaps.append("Technical skill mentions are minimal — may require skill validation")

    proj_wc = _word_count(project_experience)
    if proj_wc < 30:
        gaps.append("Project portfolio section is sparse")

    comms = compute_comms_score(motivation_text)
    if comms < 40:
        gaps.append("Communication clarity in written responses could be improved")

    return gaps[:3]


def suggest_interview_questions(
    skills_str: str,
    project_experience: str,
    internship_type: str,
    cgpa: float,
) -> list[str]:
    """Generate 3-5 contextual interview questions."""
    questions = []
    combined = f"{skills_str} {project_experience}".lower()

    tech_stack = extract_tech_skills(skills_str, project_experience)
    if tech_stack:
        questions.append(f"Walk us through a challenging project you built using {tech_stack[0]}.")
    else:
        questions.append("Describe your most technically challenging project to date.")

    if "api" in combined or "rest" in combined or "backend" in combined:
        questions.append("How do you handle error handling and authentication in REST APIs?")

    if "machine learning" in combined or "ai" in combined:
        questions.append("Explain a machine learning model you've trained. What was your evaluation strategy?")

    if internship_type == "research":
        questions.append("Describe a research problem you'd like to explore during the internship.")
    elif internship_type in ("stipend", "paid"):
        questions.append("How do you prioritize tasks when working under tight deadlines?")

    if cgpa < 7.0:
        questions.append("Are there any academic challenges that impacted your grades? How did you overcome them?")

    questions.append("Where do you see yourself professionally in 2-3 years?")
    return questions[:5]


def build_resume_summary(project_experience: str, skills_str: str, cgpa: float) -> str:
    """Short one-line summary from resume fields."""
    tech = extract_tech_skills(skills_str, project_experience)
    tech_str = ", ".join(tech[:3]) if tech else "general technical skills"
    return f"Resume highlights include {tech_str}. CGPA: {cgpa:.2f}. {_word_count(project_experience)} words of project detail detected."


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def evaluate_application(app_data: dict[str, Any]) -> dict[str, Any]:
    """
    Top-level evaluator. Accepts a normalized application dict and
    returns a flat dict of AI assessment fields.
    """
    ad = app_data.get("application_data") or {}
    ac = ad.get("academicInformation") or {}
    pr = ad.get("professionalInformation") or {}
    mo = ad.get("motivation") or {}
    isd = ad.get("internshipSpecificData") or {}

    cgpa = float(ac.get("cgpaPercentage") or 0.0)
    skills_str = pr.get("skills") or ""
    project_experience = pr.get("projectExperience") or ""
    relevant_experience = isd.get("relevantExperience") or ""
    why_internship = mo.get("whyInternship") or ""
    internship_type = ad.get("internshipType") or "free"

    sentiment = analyze_sentiment(why_internship)
    commitment = compute_commitment_score(why_internship, relevant_experience)
    comms = compute_comms_score(why_internship, project_experience)
    match_pct = compute_match_percentage(
        skills_str, cgpa, project_experience, relevant_experience, internship_type
    )
    exp_summary = build_experience_summary(
        project_experience, relevant_experience,
        skills_str.split(",") if skills_str else [],
        internship_type
    )
    strengths = identify_strengths(skills_str, project_experience, relevant_experience, cgpa, why_internship)
    weaknesses = identify_weaknesses(skills_str, project_experience, relevant_experience, cgpa, why_internship, internship_type)
    questions = suggest_interview_questions(skills_str, project_experience, internship_type, cgpa)
    resume_summary = build_resume_summary(project_experience, skills_str, cgpa)
    skill_match_pct = _clamp(match_pct * 0.9 + (cgpa / 10.0) * 10.0)  # slight weighted blend

    return {
        "aiSentiment": sentiment,
        "aiCommitmentScore": commitment,
        "aiCommunicationScore": comms,
        "aiMatchPercentage": match_pct,
        "aiExperienceSummary": exp_summary,
        "aiStrengths": strengths,
        "aiWeaknesses": weaknesses,
        "aiSuggestedQuestions": questions,
        "aiResumeSummary": resume_summary,
        "aiSkillMatchPercentage": skill_match_pct,
    }
