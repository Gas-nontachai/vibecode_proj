import { updateProfileAction } from "../profile";
import type { UpdateProfileActionState } from "../profile-state";
import { createServerSupabaseClient } from "@/lib/supabase-server";

jest.mock("@/lib/supabase-server", () => ({
  createServerSupabaseClient: jest.fn(),
}));

const mockCreateServerSupabaseClient = jest.mocked(createServerSupabaseClient);
type SupabaseServerClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

const createFormData = (values: Record<string, string>) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }
  return formData;
};

const createSupabaseMock = () => {
  const single = jest.fn();
  const select = jest.fn(() => ({ single }));
  const eq = jest.fn(() => ({ select }));
  const update = jest.fn(() => ({ eq }));
  const from = jest.fn(() => ({ update }));

  return {
    client: {
      auth: {
        getUser: jest.fn(),
      },
      from,
    },
    chains: {
      single,
      select,
      eq,
      update,
    },
  };
};

describe("updateProfileAction", () => {
  const baseState: UpdateProfileActionState = { error: "", success: "", profile: null };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns an error when the name is empty", async () => {
    const result = await updateProfileAction(baseState, createFormData({ full_name: "   " }));
    expect(result).toEqual({ error: "กรุณากรอกชื่อ-นามสกุล" });
  });

  it("returns an error if Supabase user lookup fails", async () => {
    const { client } = createSupabaseMock();
    mockCreateServerSupabaseClient.mockResolvedValue(client as unknown as SupabaseServerClient);

    client.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "Token expired" },
    });

    const result = await updateProfileAction(
      baseState,
      createFormData({ full_name: "Jane Doe" }),
    );

    expect(result).toEqual({ error: "Token expired" });
  });

  it("updates the profile and returns success", async () => {
    const { client, chains } = createSupabaseMock();
    mockCreateServerSupabaseClient.mockResolvedValue(client as unknown as SupabaseServerClient);

    client.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });

    chains.single.mockResolvedValue({
      data: { id: "user-123", full_name: "Jane Doe" },
      error: null,
    });

    const result = await updateProfileAction(
      baseState,
      createFormData({
        full_name: "Jane Doe",
        nickname: "JD",
        phone: "123456789",
      }),
    );

    expect(client.from).toHaveBeenCalledWith("profiles");
    expect(chains.update).toHaveBeenCalledWith({
      full_name: "Jane Doe",
      nickname: "JD",
      phone: "123456789",
    });
    expect(chains.eq).toHaveBeenCalledWith("id", "user-123");
    expect(chains.select).toHaveBeenCalledWith("*");
    expect(result).toEqual({
      success: "อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว",
      profile: { id: "user-123", full_name: "Jane Doe" },
    });
  });
});
