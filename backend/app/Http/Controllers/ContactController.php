<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Submit contact form
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $contact = Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => $request->subject,
            'message' => $request->message,
            'status' => 'unread',
            'priority' => 'medium',
            'source' => 'website',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully. We will get back to you soon.',
            'data' => $contact
        ], 201);
    }

    /**
     * Get all contact messages (admin only)
     */
    public function index(Request $request)
    {
        $query = Contact::with('assignedUser');

        // Apply filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $contacts = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $contacts
        ]);
    }

    /**
     * Get contact message by ID
     */
    public function show($id)
    {
        $contact = Contact::with('assignedUser')->find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Contact message not found'
            ], 404);
        }

        // Mark as read if it's unread
        if ($contact->status === 'unread') {
            $contact->markAsRead();
        }

        return response()->json([
            'success' => true,
            'data' => $contact
        ]);
    }

    /**
     * Update contact message status
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:unread,read,responded,closed',
            'priority' => 'sometimes|required|in:low,medium,high,urgent',
            'assigned_to' => 'nullable|exists:users,id',
            'response' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Contact message not found'
            ], 404);
        }

        $contact->update($request->only(['status', 'priority', 'assigned_to']));

        // If status is responded and response is provided, mark as responded
        if ($request->status === 'responded' && $request->response) {
            $contact->markAsResponded($request->response);
        }

        return response()->json([
            'success' => true,
            'message' => 'Contact message updated successfully',
            'data' => $contact
        ]);
    }

    /**
     * Respond to contact message
     */
    public function respond(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'response' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Contact message not found'
            ], 404);
        }

        $contact->markAsResponded($request->response);

        return response()->json([
            'success' => true,
            'message' => 'Response sent successfully',
            'data' => $contact
        ]);
    }

    /**
     * Delete contact message
     */
    public function destroy($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Contact message not found'
            ], 404);
        }

        $contact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Contact message deleted successfully'
        ]);
    }

    /**
     * Get contact statistics
     */
    public function statistics()
    {
        $stats = [
            'total_messages' => Contact::count(),
            'unread_messages' => Contact::unread()->count(),
            'high_priority_messages' => Contact::highPriority()->count(),
            'recent_messages' => Contact::latest()->take(5)->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
