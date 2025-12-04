import { CoreMessage, LanguageModel, StreamTextResult, ToolSet, streamText } from 'ai';
import { NullShotAgent } from './agent';
import { AgentEnv } from './env';
import { Service } from './service';

/**
 * A message from the AI UI SDK - Could not find this in the ai package
 */
export interface AIUISDKMessage {
    id: string;
    messages: CoreMessage[];
}

/**
 * A wrapper around the AI SDK to support Nullshot framework patterns
 */
export abstract class AiSdkAgent<ENV extends AgentEnv> extends NullShotAgent<ENV, AIUISDKMessage> {
    protected model: LanguageModel;

    constructor(state: DurableObjectState, env: ENV, model: LanguageModel, services: Service[] = []) {
        super(state, env, services);
        this.model = model;
    }

    /**
     * Stream text with messages (conversation mode)
     * This is the main method used by prediction market agent
     */
    protected async streamTextWithMessages(
        sessionId: string,
        messages: CoreMessage[],
        options: any = {},
    ): Promise<StreamTextResult<ToolSet, string>> {
        // Call AI SDK streamText with all options
        return streamText({
            model: this.model,
            messages,
            experimental_generateMessageId: () => `${sessionId}-${crypto.randomUUID()}`,
            ...options,
        });
    }
}
