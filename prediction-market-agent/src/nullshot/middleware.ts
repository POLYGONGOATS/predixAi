import {
    CoreMessage,
    ToolSet,
    LanguageModel,
    ToolChoice,
    TelemetrySettings,
    StreamTextTransform,
    StreamTextOnChunkCallback,
    StreamTextOnErrorCallback,
    StreamTextOnFinishCallback,
    StreamTextOnStepFinishCallback,
    ToolCallRepairFunction,
} from 'ai';

import { Service } from './service';

// Type for ID generator function
type IDGenerator = () => string;

// Simplified abort callback type
type StreamTextOnAbortCallback<TOOLS extends ToolSet> = (event: { readonly steps: any[] }) => PromiseLike<void> | void;

/**
 * Base parameters shared between messages and prompt modes
 */
interface StreamTextParams {
    // Core parameters
    model: string | LanguageModel;

    // Tool-related parameters
    tools?: ToolSet;
    toolChoice?: ToolChoice<ToolSet>;

    // Generation settings
    maxOutputTokens?: number;
    temperature?: number;
    topP?: number;
    topK?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    stopSequences?: string[];
    seed?: number;

    // Request settings
    maxRetries?: number;
    abortSignal?: AbortSignal;
    headers?: Record<string, string | undefined>;

    // Step control
    maxSteps?: number;
    experimental_generateMessageId?: IDGenerator;
    experimental_continueSteps?: boolean;

    // Tool control
    experimental_activeTools?: Array<keyof ToolSet>;
    activeTools?: Array<keyof ToolSet>;
    experimental_repairToolCall?: ToolCallRepairFunction<ToolSet>;
    toolCallStreaming?: boolean;
    experimental_toolCallStreaming?: boolean;

    // Output and streaming
    experimental_output?: any;
    experimental_transform?: StreamTextTransform<ToolSet> | Array<StreamTextTransform<ToolSet>>;
    includeRawChunks?: boolean;
    experimental_context?: unknown;

    // Callbacks
    onChunk?: StreamTextOnChunkCallback<ToolSet>;
    onError?: StreamTextOnErrorCallback;
    onFinish?: StreamTextOnFinishCallback<ToolSet>;
    onStepFinish?: StreamTextOnStepFinishCallback<ToolSet>;
    onAbort?: StreamTextOnAbortCallback<ToolSet>;

    // Provider options
    providerOptions?: Record<string, any>;
    experimental_telemetry?: TelemetrySettings;

    // Internal options
    _internal?: {
        now?: () => number;
        generateId?: IDGenerator;
        currentDate?: () => Date;
    };
}

/**
 * Parameters for streamText with messages (conversation mode)
 */
export interface StreamTextWithMessagesParams extends StreamTextParams {
    messages: CoreMessage[];
    system?: string;
}

/**
 * Parameters for streamText with prompt (single prompt mode)
 */
export interface StreamTextWithPromptParams extends StreamTextParams {
    prompt: string;
    system?: string;
}

export interface MiddlewareService extends Service {
    /**
     * Transform tools in streamText parameters
     */
    transformStreamTextTools?(tools?: ToolSet): ToolSet;
}

export function isMiddlewareService(service: Service): service is MiddlewareService {
    return ('transformStreamTextTools' in service && typeof service.transformStreamTextTools === 'function');
}
