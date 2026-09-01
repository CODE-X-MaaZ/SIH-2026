import { Complaint, Incident } from "@/types";
import { IComplaintRepository, IIncidentRepository } from "./repository";
import { DEMO_COMPLAINTS } from "@/data/demo/complaints";
import { DEMO_INCIDENTS } from "@/data/demo/incidents";

export class DemoComplaintRepository implements IComplaintRepository {
    private getLocalComplaints(): Complaint[] {
        if (typeof window === "undefined") return DEMO_COMPLAINTS;
        const stored = localStorage.getItem("nagrik_demo_complaints");
        if (!stored) {
            localStorage.setItem("nagrik_demo_complaints", JSON.stringify(DEMO_COMPLAINTS));
            return DEMO_COMPLAINTS;
        }
        return JSON.parse(stored);
    }

    private saveLocalComplaints(complaints: Complaint[]) {
        if (typeof window !== "undefined") {
            localStorage.setItem("nagrik_demo_complaints", JSON.stringify(complaints));
        }
    }

    async getComplaint(id: string): Promise<Complaint | null> {
        const complaints = this.getLocalComplaints();
        return complaints.find(c => c.id === id) || null;
    }

    async getComplaintByTrackingId(trackingId: string): Promise<Complaint | null> {
        const complaints = this.getLocalComplaints();
        return complaints.find(c => c.trackingId === trackingId) || null;
    }

    async listComplaints(filters?: any): Promise<Complaint[]> {
        return this.getLocalComplaints();
    }

    async createComplaint(complaintData: Partial<Complaint>): Promise<Complaint> {
        const complaints = this.getLocalComplaints();

        const newComplaint: Complaint = {
            id: `CMP-NEW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            trackingId: complaintData.trackingId || `NR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            originalText: complaintData.originalText || "",
            normalizedText: complaintData.normalizedText || "",
            detectedLanguage: complaintData.detectedLanguage || "Unknown",
            category: complaintData.category || "Other",
            issueTitle: complaintData.issueTitle || "Issue",
            priority: complaintData.priority || "LOW",
            confidence: complaintData.confidence || 0,
            explanation: complaintData.explanation || "",
            latitude: complaintData.latitude,
            longitude: complaintData.longitude,
            locationLabel: complaintData.locationLabel,
            status: "SUBMITTED",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...complaintData
        };

        complaints.push(newComplaint);
        this.saveLocalComplaints(complaints);

        return newComplaint;
    }

    async updateComplaint(id: string, updates: Partial<Complaint>): Promise<Complaint> {
        const complaints = this.getLocalComplaints();
        const index = complaints.findIndex(c => c.id === id);

        if (index === -1) throw new Error("Complaint not found");

        const updated = {
            ...complaints[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        complaints[index] = updated;
        this.saveLocalComplaints(complaints);

        return updated;
    }
}

export class DemoIncidentRepository implements IIncidentRepository {
    private getLocalIncidents(): Incident[] {
        if (typeof window === "undefined") return DEMO_INCIDENTS;
        const stored = localStorage.getItem("nagrik_demo_incidents");
        if (!stored) {
            localStorage.setItem("nagrik_demo_incidents", JSON.stringify(DEMO_INCIDENTS));
            return DEMO_INCIDENTS;
        }
        return JSON.parse(stored);
    }

    private saveLocalIncidents(incidents: Incident[]) {
        if (typeof window !== "undefined") {
            localStorage.setItem("nagrik_demo_incidents", JSON.stringify(incidents));
        }
    }

    async getIncident(id: string): Promise<Incident | null> {
        const incidents = this.getLocalIncidents();
        return incidents.find(i => i.id === id) || null;
    }

    async listIncidents(filters?: any): Promise<Incident[]> {
        return this.getLocalIncidents();
    }

    async updateIncident(id: string, updates: Partial<Incident>): Promise<Incident> {
        const incidents = this.getLocalIncidents();
        const index = incidents.findIndex(i => i.id === id);

        if (index === -1) throw new Error("Incident not found");

        const updated = {
            ...incidents[index],
            ...updates
        };

        incidents[index] = updated;
        this.saveLocalIncidents(incidents);

        return updated;
    }
}
