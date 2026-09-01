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
    private getLocalIncidentsOverridden(): Incident[] {
        // 1. Get raw complaints natively from DemoComplaintRepository
        // This ensures citizen additions are processed
        const compRepo = new DemoComplaintRepository();

        let complaints = [];
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("nagrik_demo_complaints");
            if (stored) {
                complaints = JSON.parse(stored);
            }
        }
        if (complaints.length === 0) complaints = DEMO_COMPLAINTS;

        // 2. Process Radar Clustering iteratively overriding the build-time generation
        const { buildIncidents } = require("@/lib/radar/clustering");
        const generated = buildIncidents(complaints);

        // 3. Apply manual overrides (status, etc.)
        let storedIncidents: Incident[] = DEMO_INCIDENTS;
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("nagrik_demo_incidents");
            if (stored) storedIncidents = JSON.parse(stored);
            else localStorage.setItem("nagrik_demo_incidents", JSON.stringify(DEMO_INCIDENTS));
        }

        const merged = generated.map((gen: Incident) => {
            const override = storedIncidents.find((i: Incident) => i.id === gen.id);
            if (override) {
                return { ...gen, status: override.status };
            }
            return gen;
        });

        // Add back incidents that were in stored but aren't in generated anymore? None, demo is append-only.
        return merged;
    }

    private getLocalIncidents(): Incident[] {
        return this.getLocalIncidentsOverridden();
    }

    private saveLocalIncidents(incidents: Incident[]) {
        if (typeof window !== "undefined") {
            localStorage.setItem("nagrik_demo_incidents", JSON.stringify(incidents));
        }
    }

    async getIncident(id: string): Promise<Incident | null> {
        const incidents = this.getLocalIncidentsOverridden();
        return incidents.find(i => i.id === id) || null;
    }

    async listIncidents(filters?: any): Promise<Incident[]> {
        return this.getLocalIncidentsOverridden();
    }

    async updateIncident(id: string, updates: Partial<Incident>): Promise<Incident> {
        // For updates, we fetch the overridden, identify the update, and save the base version overridden 
        // into nagrik_demo_incidents since the recalculation always respects nagrik_demo_incidents overrides.
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
