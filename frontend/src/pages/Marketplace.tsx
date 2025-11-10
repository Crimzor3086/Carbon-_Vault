import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Listing {
  id: string;
  seller: string;
  amount: number;
  price: number;
  offsetType: string;
  vintage: string;
  yield: string;
}

const listings: Listing[] = [];

const Marketplace = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 lg:p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Marketplace
              </h1>
              <p className="text-muted-foreground">
                Buy and sell carbon credit tokens
              </p>
            </div>

            {/* Filters */}
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search listings..."
                      className="pl-9"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Offset Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="reforestation">Reforestation</SelectItem>
                      <SelectItem value="renewable">Renewable Energy</SelectItem>
                      <SelectItem value="capture">Carbon Capture</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Vintage Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Listings Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {listings.length === 0 ? (
                <Card className="shadow-card md:col-span-2">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">No listings available</p>
                    <p className="text-sm text-muted-foreground">Check back later for new carbon credit listings</p>
                  </CardContent>
                </Card>
              ) : (
                listings.map((listing) => (
                  <Card key={listing.id} className="shadow-card hover:shadow-hover transition-smooth">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{listing.amount} CVT</CardTitle>
                          <CardDescription className="mt-1">
                            Seller: {listing.seller}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          {listing.yield} APY
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Badge variant="outline">{listing.offsetType}</Badge>
                        <Badge variant="outline">Vintage {listing.vintage}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Price per CVT</p>
                          <p className="text-2xl font-bold text-foreground">
                            ${listing.price}
                          </p>
                        </div>
                        <Button className="gradient-primary gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Buy Now
                        </Button>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Total: ${(listing.amount * listing.price).toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Marketplace;
