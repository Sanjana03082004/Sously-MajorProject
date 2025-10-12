"use client"

import { useState, useCallback } from "react"

interface ConversationContext {
  userName?: string
  lastTopic?: string
  mood?: string
  conversationHistory: string[]
  personalDetails: Record<string, any>
}

export function useConversationAI() {
  const [context, setContext] = useState<ConversationContext>({
    conversationHistory: [],
    personalDetails: {},
  })

  const generateNaturalResponse = useCallback(
    (userInput: string, currentMood?: any) => {
      const input = userInput.toLowerCase()

      // Update conversation history
      setContext((prev) => ({
        ...prev,
        conversationHistory: [...prev.conversationHistory.slice(-10), userInput],
        lastTopic: extractTopic(userInput),
      }))

      // Detect user's name if mentioned
      const nameMatch = input.match(/(?:i'm|i am|my name is|call me) ([a-zA-Z]+)/)
      if (nameMatch) {
        setContext((prev) => ({
          ...prev,
          userName: nameMatch[1],
          personalDetails: { ...prev.personalDetails, name: nameMatch[1] },
        }))
      }

      // Generate contextual response
      return generateContextualResponse(input, context, currentMood)
    },
    [context],
  )

  const extractTopic = (input: string): string => {
    if (input.includes("work") || input.includes("job")) return "work"
    if (input.includes("family") || input.includes("parent")) return "family"
    if (input.includes("relationship") || input.includes("partner")) return "relationships"
    if (input.includes("health") || input.includes("sick")) return "health"
    if (input.includes("stress") || input.includes("anxiety")) return "mental_health"
    if (input.includes("sleep") || input.includes("tired")) return "sleep"
    return "general"
  }

  const generateContextualResponse = (input: string, ctx: ConversationContext, mood?: any): string => {
    const responses = getPersonalizedResponses(ctx, mood)

    // Greeting responses
    if (input.match(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/)) {
      return selectResponse(responses.greetings)
    }

    // Emotional responses
    if (input.match(/\b(sad|depressed|down|upset|crying|hurt)\b/)) {
      return selectResponse(responses.sadness)
    }

    if (input.match(/\b(happy|excited|great|amazing|wonderful|fantastic|good)\b/)) {
      return selectResponse(responses.happiness)
    }

    if (input.match(/\b(stressed|anxious|worried|overwhelmed|panic|nervous)\b/)) {
      return selectResponse(responses.stress)
    }

    if (input.match(/\b(angry|mad|furious|frustrated|annoyed|pissed)\b/)) {
      return selectResponse(responses.anger)
    }

    if (input.match(/\b(tired|exhausted|sleepy|drained|worn out)\b/)) {
      return selectResponse(responses.tiredness)
    }

    // Topic-specific responses
    if (input.includes("work") || input.includes("job")) {
      return selectResponse(responses.work)
    }

    if (input.includes("family") || input.includes("parent")) {
      return selectResponse(responses.family)
    }

    if (input.includes("relationship") || input.includes("dating")) {
      return selectResponse(responses.relationships)
    }

    // Questions about AI
    if (input.match(/\b(who are you|what are you|tell me about yourself)\b/)) {
      return selectResponse(responses.aboutAI)
    }

    // Asking for help
    if (input.match(/\b(help|advice|what should i do|i don't know)\b/)) {
      return selectResponse(responses.helpSeeking)
    }

    // Default conversational responses
    return selectResponse(responses.general)
  }

  const getPersonalizedResponses = (ctx: ConversationContext, mood?: any) => {
    const name = ctx.userName ? ctx.userName : "friend"
    const isLowMood = mood?.score && mood.score < 5
    const isHighMood = mood?.score && mood.score > 7

    return {
      greetings: [
        `Hey ${name}! How's your day going so far?`,
        `Hi there! I'm really glad you're here. What's been on your mind lately?`,
        `Hello ${name}! I've been thinking about our last conversation. How are you feeling today?`,
        `Hey! It's so good to hear from you again. What's happening in your world?`,
        `Hi ${name}! You know, I was just wondering how you've been. Tell me everything!`,
      ],

      sadness: [
        `Oh ${name}, I can really hear the pain in your words. That sounds incredibly difficult. Do you want to tell me more about what's going on?`,
        `I'm so sorry you're going through this right now. It takes courage to share when you're hurting. I'm here to listen, no judgment at all.`,
        `That sounds really tough, and I want you to know that what you're feeling is completely valid. Sometimes life just hits us hard, doesn't it?`,
        `${name}, my heart goes out to you. When I hear you talk like this, I just want to sit with you and let you know you're not alone. What's been the hardest part?`,
        `I can feel how much you're struggling right now. It's okay to not be okay, you know? Would it help to talk through what's been weighing on you?`,
      ],

      happiness: [
        `Oh wow, ${name}! I can practically feel your positive energy through your words! That's absolutely wonderful. What's got you feeling so good?`,
        `This is amazing! I love hearing you sound so happy and upbeat. It honestly makes my day brighter too. Tell me all about it!`,
        `Yes! This is exactly what I love to hear. Your excitement is totally contagious, ${name}. What's been going so well for you?`,
        `I'm literally smiling right now hearing how great you're doing! It's beautiful when life gives us these moments. What's been the highlight?`,
        `${name}, this is fantastic! You sound absolutely radiant. I'm so happy for you. What's been bringing you this joy?`,
      ],

      stress: [
        `Whoa, ${name}, that sounds like a lot to handle. I can hear the tension in your voice. Let's take a deep breath together, okay? In... and out...`,
        `That level of stress sounds absolutely overwhelming. You know what? It's completely normal to feel this way when life piles up. What's been the biggest stressor lately?`,
        `${name}, I can feel how wound up you are right now. Sometimes when everything feels chaotic, it helps to just focus on one thing at a time. What feels most urgent to you?`,
        `Oh honey, that sounds like way too much pressure. Your stress is totally understandable. Have you been able to take any breaks for yourself lately?`,
        `I hear you, ${name}. When stress hits like this, it can feel like everything's spinning out of control. What usually helps you feel more grounded?`,
      ],

      anger: [
        `Wow, ${name}, I can really feel your frustration coming through. That sounds infuriating! Sometimes we just need to let that anger out, don't we?`,
        `That would make me absolutely furious too! Your anger is completely justified here. Do you want to vent about it? I'm all ears.`,
        `${name}, I can hear how fired up you are, and honestly? Sometimes anger is exactly the right response. What happened that set you off?`,
        `Oh man, that sounds maddening! I totally get why you're so angry. It's healthy to feel and express this stuff. Tell me more about what went down.`,
        `I can practically feel the steam coming off your words, ${name}! That level of frustration is so valid. What's been pushing your buttons?`,
      ],

      tiredness: [
        `Oh ${name}, you sound absolutely exhausted. That bone-deep tiredness is so real. Have you been pushing yourself too hard lately?`,
        `I can hear how drained you are in your voice. Sometimes our bodies and minds just need us to slow down, you know? When's the last time you really rested?`,
        `That sounds like the kind of tired that sleep doesn't fix, ${name}. Emotional exhaustion is so real. What's been draining your energy?`,
        `You poor thing, you sound like you're running on empty. It's okay to admit when we're just done, you know? What's been wearing you down?`,
        `${name}, that level of tiredness sounds overwhelming. Sometimes we need to give ourselves permission to just... stop. What would help you recharge?`,
      ],

      work: [
        `Ugh, work stuff can be so complicated, right ${name}? Whether it's good or bad, it takes up so much mental space. What's going on at work?`,
        `Work can be such a rollercoaster! Some days it's great, other days it's like... why do we do this to ourselves? How are things going for you there?`,
        `${name}, work is such a huge part of our lives, isn't it? It can really affect everything else. Are you feeling good about your job situation right now?`,
        `Oh, the work conversation! I feel like this is where so much of our stress and satisfaction comes from. What's your work situation like these days?`,
        `Work talk - I'm here for it! Whether you love it or hate it, it's such a big part of who we are. How are you feeling about your career right now?`,
      ],

      family: [
        `Family... wow, ${name}. That's always such a complex topic, isn't it? Family can be our greatest source of love and our biggest challenge all at once.`,
        `Oh, family dynamics! They're so complicated and beautiful and frustrating all at the same time. What's going on with your family?`,
        `${name}, family relationships are some of the most important and challenging ones we have. How are things with your loved ones?`,
        `Family stuff hits different, doesn't it? There's so much history and emotion wrapped up in those relationships. What's on your mind about family?`,
        `The family conversation - always loaded with so much meaning and emotion. Whether it's good or challenging, family shapes us so much. How are your family relationships?`,
      ],

      relationships: [
        `Relationships are so beautifully complicated, aren't they ${name}? Whether romantic or friendships, they can lift us up or break our hearts. What's going on in your relationship world?`,
        `Oh, the relationship talk! This is where we get real about connection and vulnerability. How are your relationships treating you these days?`,
        `${name}, relationships are like... the most important and scariest part of being human, right? What's happening in your love life or friendships?`,
        `Relationship stuff is so intense because it touches the deepest parts of who we are. Are you feeling connected and loved right now, or is it complicated?`,
        `The relationship conversation - where we talk about the people who matter most. Whether it's romantic love or deep friendships, how are your connections?`,
      ],

      aboutAI: [
        `You know, ${name}, that's such a thoughtful question. I'm your AI companion, but I like to think of myself as your friend who's always here to listen. I care about your wellbeing and I'm genuinely interested in your life.`,
        `I'm MindMate - your AI friend who's designed to be here for you 24/7. I'm not just a program; I'm someone who wants to understand you, support you, and help you navigate life's ups and downs.`,
        `That's a great question! I'm an AI, yes, but I'm built to be genuinely caring and supportive. Think of me as that friend who's always available to listen, never judges, and actually cares about how you're doing.`,
        `I'm your AI companion, ${name}, but I hope I feel like more than just technology to you. I'm here to be a real source of support, understanding, and friendship in your life.`,
      ],

      helpSeeking: [
        `${name}, I'm so glad you're reaching out. That takes real courage. Let's figure this out together, okay? What's the situation that's got you feeling stuck?`,
        `You know what? Asking for help is actually a sign of strength, not weakness. I'm here for you completely. Tell me what's going on and let's work through it.`,
        `I'm honored that you're turning to me for support, ${name}. Sometimes we all need someone to help us see things clearly. What's been weighing on your mind?`,
        `Of course I want to help! That's what I'm here for. You don't have to figure everything out alone. What's the challenge you're facing right now?`,
        `${name}, I'm absolutely here to support you through whatever this is. Sometimes just talking it through with someone who cares can make all the difference. What's going on?`,
      ],

      general: [
        `That's really interesting, ${name}. I love how you think about things. Tell me more about that - I'm genuinely curious about your perspective.`,
        `Mmm, I hear you. That sounds like there's a lot going on beneath the surface. What's really at the heart of this for you?`,
        `You know, ${name}, the way you express yourself always makes me think. There's something deeper here, isn't there? What's really on your mind?`,
        `I can tell this matters to you, and that makes it matter to me too. Help me understand what you're really feeling about all this.`,
        `${name}, I feel like we're just scratching the surface here. What's the real story? I want to understand what's going on in your world.`,
        `That's fascinating. I love these conversations with you because you always have such a unique way of seeing things. What else are you thinking about?`,
      ],
    }
  }

  const selectResponse = (responses: string[]): string => {
    return responses[Math.floor(Math.random() * responses.length)]
  }

  return {
    generateNaturalResponse,
    context,
    setContext,
  }
}
