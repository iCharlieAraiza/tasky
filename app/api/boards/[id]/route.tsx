export async function GET() {
    const obj = {
        id: "Board name",
        name: "New Container",
        description: "Board description",
        background:{
            id: "bg-5",
            value: "bg-5",
            url: "https://images.unsplash.com/photo-1521080755838-d2311117f767?q=80&w=1924&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            thumb: "https://images.unsplash.com/photo-1521080755838-d2311117f767?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI0fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D"
            //thumb: "https://images.unsplash.com/photo-1703016445127-73076df4814b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            //url:"https://images.unsplash.com/photo-1703016445127-73076df4814b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        slug: "board-slug",
        isPrivate: false,
        isArchived: false,
        isStarred: false,
        isPinned: false,
        archive:[],
        containers: [
            {
                "id": "container-1",
                "title": "To do",
                "items": [
                    {
                        "id": "item-1Placeholder",
                        "title": "Item Principal 1",
                        "isPlaceholder": true,
                    },
                    {
                        "id": "item-213k12nklnsdfsDFJksdfksdmlmldsfnkl",
                        "title": "Item Principal 1",
                        "description": "Item description defined",
                        "member": {
                            "id": "member-1",
                            "name": "Carlos Araiza",
                            "avatar": "https://images.unsplash.com/photo-1521080755838-d2311117f767?q=80&w=1924&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        },
                        "isPlaceholder": false,
                        "label": [{
                            "id": "label-1",
                            "title": "Important",
                            "color": "red",
                        }]
                    },
                ]
            },
            {
                "id": "container-2",
                "title": "In Progress",
                "items": [
                    {
                        "id": "item-2Placeholder",
                        "title": "Item Principal 2",
                        "isPlaceholder": true,
                    },
                ]
            },
            {
                "id": "container-3",
                "title": "Done",
                "items": [
                    {
                        "id": "item-3Placeholder",
                        "title": "Item Principal 1",
                        "isPlaceholder": true,
                    },
                ]
            }
        ]
    };
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
        type: "application/json",
    });
    const myOptions = { status: 200, statusText: "Ok" };
    const myResponse = new Response(blob, myOptions);

    return myResponse;
    // Compare this snippet from app/%28platform%29/%28dashboard%29/boards/index.tsx:
    // import { useSession } from "next-auth/react";
}

