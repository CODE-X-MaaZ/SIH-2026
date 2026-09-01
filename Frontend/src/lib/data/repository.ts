import { Complaint, Incident } from "@/types";

export interface IComplaintRepository {
    getComplaint(id: string): Promise<Complaint | null>;
    getComplaintByTrackingId(trackingId: string): Promise<Complaint | null>;
    listComplaints(filters?: any): Promise<Complaint[]>;
    createComplaint(complaint: Partial<Complaint>): Promise<Complaint>;
    updateComplaint(id: string, updates: Partial<Complaint>): Promise<Complaint>;
}

export interface IIncidentRepository {
    getIncident(id: string): Promise<Incident | null>;
    listIncidents(filters?: any): Promise<Incident[]>;
    updateIncident(id: string, updates: Partial<Incident>): Promise<Incident>;
}
