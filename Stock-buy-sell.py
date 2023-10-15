# Python3 implementation of the approach 

# Function to return the maximum profit 
# that can be made after buying and 
# selling the given stocks 
def maxProfit(price, start, end): 

	# If the stocks can't be bought 
	if (end <= start): 
		return 0; 

	# Initialise the profit 
	profit = 0; 

	# The day at which the stock 
	# must be bought 
	for i in range(start, end, 1): 

		# The day at which the 
		# stock must be sold 
		for j in range(i+1, end+1): 

			# If buying the stock at ith day and 
			# selling it at jth day is profitable 
			if (price[j] > price[i]): 
				
				# Update the current profit 
				curr_profit = price[j] - price[i] + maxProfit(price, start, i - 1)+ maxProfit(price, j + 1, end); 

				# Update the maximum profit so far 
				profit = max(profit, curr_profit); 

	return profit; 

# Driver code 
if __name__ == '__main__': 
	price = [100, 180, 260, 
			310, 40, 535, 695]; 
	n = len(price); 
	print(maxProfit(price, 0, n - 1)); 
# This code is contributed by Rajput-Ji 
