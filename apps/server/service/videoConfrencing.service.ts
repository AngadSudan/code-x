import axios, { type AxiosInstance } from "axios";

class VideoConferencingService {
  private client: AxiosInstance | null;
  private apiKey: string;
  constructor() {
    this.apiKey = process.env.DAILY_API_KEY!;
    this.client = axios.create({
      baseURL: "https://api.daily.co/v1",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  async createMeet(slug: string, config: any) {
    const data = await this.client?.post("/rooms", { name: slug });
    return data?.data;
  }
  async getMeet(slug: string) {
    const data = await this.client?.get(`/rooms/${slug}`);
    return data?.data;
  }
  async deleteMeet(slug: string) {
    const data = await this.client?.delete(`/rooms/${slug}`);
    return data?.data;
  }
  async createToken(
    slug: string,
    userId: string,
    username: string,
    role: "host" | "guest",
  ) {
    const data = await this.client?.post(`/meeting-tokens`, {
      name: slug,
      is_owner: role === "guest",
      user_name: username,
      userId,
    });

    return data?.data.token;
  }
  async startRecording(slug: string) {
    const data = await this.client?.post(`/rooms/${slug}/recordings/start`);
    return data?.data;
  }
  async stopRecording(slug: string) {
    const data = await this.client?.post(`/rooms/${slug}/recordings/stop`);
    return data?.data;
  }
  async startTranscription(slug: string) {
    const data = await this.client?.post(`/rooms/${slug}/transcription/start`);
    return data?.data;
  }
  async stopTranscription(slug: string) {
    const data = await this.client?.post(`/rooms/${slug}/transcription/stop`);
    return data?.data;
  }
  async getRecordings(slug: string) {
    const data = await this.client?.get("/recordings", {
      params: {
        room_name: slug,
      },
    });

    return data?.data.data.map((rec: any) => ({
      id: rec.id,
      roomName: rec.room_name,
      status: rec.status,
      startedAt: rec.start_ts,
      duration: rec.duration,
      videoUrl: rec.download_url,
    }));
  }
  async getTranscript(slug: string) {
    const data = await this.client?.get("/transcripts", {
      params: {
        room_name: slug,
      },
    });

    return data?.data.data.map((t: any) => ({
      id: t.id,
      roomName: t.room_name,
      status: t.status,
      language: t.language,
      transcriptUrl: t.download_url,
    }));
  }
}

export default new VideoConferencingService();
