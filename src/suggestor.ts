export type Suggestion = {
    id: string;
    title: string;
    description: string;
    sampleOutput: string;
    promptTemplate: string;
};


function splitSentences(text: string): string[] {
    return text
        .replace(/\n+/g, " ")
        .split(/(?<=[.?!])\s+/)
        .filter(s => s.trim().length > 0);
}


function extractActions(text: string): string[] {
    const keywords = [
        "check",
        "verify",
        "confirm",
        "send",
        "fix",
        "review",
        "update",
        "prepare",
        "reply",
        "discuss"
    ];

    const sentences = splitSentences(text);
    const actions: string[] = [];

    for (let s of sentences) {
        const lower = s.toLowerCase();
        for (let k of keywords) {
            if (lower.includes(k)) {
                actions.push(s.trim());
                break;
            }
        }
    }

    return actions;
}


function generateSummary(text: string): string[] {
    const sentences = splitSentences(text);

    return sentences.slice(0, 5);
}


function draftReply(text: string): string {
    const sentences = splitSentences(text);
    const last = sentences[sentences.length - 1] || "";

    return (
        "Thanks for the update! I’ll take care of the following:\n\n" +
        "- Review the details mentioned\n" +
        "- Follow up where needed\n\n" +
        "Regarding your last point: \"" +
        last.trim() +
        "\" — I'll handle that shortly and update you soon."
    );
}

export function generateSuggestions(contextText: string): Suggestion[] {
    const summary = generateSummary(contextText);
    const actions = extractActions(contextText);
    const reply = draftReply(contextText);

    return [
        {
            id: "summarize-1",
            title: "Summarize conversation (5 bullets)",
            description: "Summarize the selected text into concise bullets.",
            sampleOutput: summary.map(s => "- " + s).join("\n"),
            promptTemplate: `Summarize into bullets:\n\n${contextText}`
        },
        {
            id: "actions-1",
            title: "Extract action items",
            description: "Extract actionable tasks from the conversation.",
            sampleOutput:
                actions.length > 0
                    ? actions.map(a => `- [ ] ${a}`).join("\n")
                    : "- No clear action items detected.",
            promptTemplate: `Extract action items:\n\n${contextText}`
        },
        {
            id: "reply-1",
            title: "Draft a polite reply",
            description: "Create a short professional reply to the latest message.",
            sampleOutput: reply,
            promptTemplate: `Write a reply to the conversation:\n\n${contextText}`
        }
    ];
}
