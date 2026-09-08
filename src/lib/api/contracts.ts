import { apiGet, apiPatch, apiPost } from "../api";

const B = "/api/proxy/contracts";

export type ContractStatus = "PENDING" | "SIGNED" | "TERMINATED";

export interface Contract {
  contract_id: number;
  scholar_profile_id: number;
  contract_number: string;
  // Unsigned draft PDF (present while PENDING).
  document_url?: string | null;
  signed_document_url?: string | null;
  signature_url?: string | null;
  certificate_id?: string | null;
  status: ContractStatus;
  effective_date?: string | null;
  expiry_date?: string | null;
  signed_at?: string | null;
}

export function createContract(data: {
  scholar_profile_id: number;
  contract_number: string;
  effective_date?: string;
  expiry_date?: string;
}) {
  return apiPost<Contract>(B, data);
}

export function getMyContracts() {
  return apiGet<Contract[]>(`${B}/me`);
}

export function verifyContract(certificateId: string) {
  return apiGet<Contract>(`${B}/verify/${certificateId}`);
}

export function listContracts(params?: { status?: ContractStatus }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  const query = qs.toString();
  return apiGet<Contract[]>(`${B}${query ? `?${query}` : ""}`);
}

export function requestContractChanges(id: number, reason: string) {
  return apiPost<Contract>(`${B}/${id}/request-changes`, { reason });
}

export function signContract(id: number, data: { signature_base64?: string; signature_file?: File }) {
  if (data.signature_file) {
    const form = new FormData();
    form.append("signature", data.signature_file);
    return apiPatch<Contract>(`${B}/${id}/sign`, form);
  }
  return apiPatch<Contract>(`${B}/${id}/sign`, {
    signature_base64: data.signature_base64,
  });
}
